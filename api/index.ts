/// <reference types="./types/express-form-data" />
import bodyParser from 'body-parser'
import express, { Request } from 'express'
import expressFormData from 'express-form-data'
import { File as MultipartyFile } from 'multiparty'
import { NO_CONTENT, UNPROCESSABLE_ENTITY } from 'http-status-codes'
import 'reflect-metadata'
import version_check_middleware from './version-check-middleware'
import error_router from './routers/error-router'
import MailService from './services/MailService'
import { env, error, log, html_escape } from './utils'
import { createConnection, getManager } from 'typeorm'
import { promisify } from 'util'
import fs from 'fs'
import { ValidationError } from 'class-validator'
//@ts-ignore
import fetch from 'node-fetch'
import zlib from 'zlib'
//@ts-ignore
import VolatileMap from 'volatile-map'

// ///////////////// CONFIG

const mail_service = new MailService(env('MAIL_SENDER_SMTP_HOST'), env('MAIL_SENDER_USER'), env('MAIL_SENDER_PASSWORD'))

// When changing this, a files moving migration is required
export const FILES_DIR = "files/"

/**
 * @param file_param the form data file key name.
 * @param filename you must make sure that this param is escaped properly and
 * that the respective file name does not yet exist! (somewhat solvable by e.g. prefixing with `Date.now()`).
 *
 * When this function returns successfully, you can then in future access the file with
 * `readFile` @ `FILES_DIR + filename`
 * ```
 */
export const save_uploaded_file = async (req: Request, file_param: string, filename: string): Promise<boolean> => {
	const file_in_upload_tmp: MultipartyFile | undefined = (req as any).files[file_param]
	if(!file_in_upload_tmp)
		return false
	// return new Binary(await promisify(fs.readFile)(tmp_path))
	const dest_path = FILES_DIR + filename
	if(await promisify(fs.exists)(dest_path)) {
		error(`Tried to save uploaded file to path "${dest_path}" but it already exists!"`) // " (quote for micro editor syntax highlighting bug)
		return false
	}
	await promisify(fs.rename)(file_in_upload_tmp.path, dest_path)
	return true
}

// ////////////////// ROUTES

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(expressFormData.parse())

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*') // fixme

	res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-app-version')
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'GET')
		res.sendStatus(NO_CONTENT)
		return
	}
	// setTimeout(next, 150);
	next()
})

app.use(version_check_middleware)
app.use('/error', error_router(mail_service))
app.use((req, res, next) => {
	const status_orig = res.status
	res.status = the_status => {
		if(!the_status.toString().startsWith("2")) {
			log(`A request failed with non-200 status ${the_status}: ${req.method} ${req.originalUrl}, ${JSON.stringify(req.body)} - ${res.locals.user?.email||'NOUSER'}`)
		}
		res.status = status_orig
		return res.status(the_status)
	}
	next()
})

app.get('/search', async (req, res) => {
	const limit = Math.min(Number(req.query.l) || 100, 500)
	try {
		const result = await getManager().query(`select fts.site, fts.title from fts where fts match ? limit ?`, [req.query.q, limit])
		return res.send(result)
	} catch(e) {
		console.warn(e)
		return res.send([])
	}
})

const cached_cache = new VolatileMap(40000)

app.get('/cached', async (req, res) => {
	//@ts-ignore
	const url = `http://index.commoncrawl.org/CC-MAIN-2021-43-index?` + new URLSearchParams({
		url: req.query.site + '',
		output: 'json',
	})
	const cached_cached = cached_cache.get(url)
	if(cached_cached)
		return res.send(cached_cached)
	
	let response = await fetch(url)
	if(!response.ok)
		return res.status(500).send('Could not reach Common Crawl index')
	const json = (await response.text())
		.split('\n').filter(Boolean)
		.map((line: string) => JSON.parse(line))
		.find((j: any) => j.status == 200)
	response = await fetch(`https://commoncrawl.s3.amazonaws.com/${json.filename}`, {
		headers: {
			Range: `bytes=${json.offset}-${json.offset*1+json.length*1}`
		}
	})
	if(!response.ok)
		return res.status(500).send('Could not reach Common Crawl data')
	const gzipped_buffer: ArrayBuffer = await response.arrayBuffer()

	// Would work, but unexpected eof will fail:
	// const gunzipped_buffer = await promisify(zlib.gunzip)(gzipped_buffer)
	// Instead, custom processing via stackoverflow.com/q/33926969
	const gunzipped_buffer: Buffer = await new Promise((resolve, reject) => {
		const buffer_builder: Buffer[] = []
		const decompress_stream = zlib.createGunzip()
			.on('data', (chunk: Buffer) => {
				buffer_builder.push(chunk)
				// decompress_stream.pause()
			}).on('close', () => {
				resolve(Buffer.concat(buffer_builder))
			}).on('error', (err) => {
				// EOF: expected
				//@ts-ignore
				if(err.errno !== -5)
					reject(err)
				else
					resolve(Buffer.concat(buffer_builder))
			});
		decompress_stream.write(Buffer.from(gzipped_buffer))
		decompress_stream.end()
	})
	
	const lines = gunzipped_buffer.toString().split('\n')
	let c_blank_line = 0
	let i = 0
	for(; i < lines.length; i++) {
		if(lines[i] === '' || lines[i] === '\r')
			c_blank_line++
		if(c_blank_line === 2)
			break
	}
	const text = lines.slice(i).join('\n')

	cached_cache.set(url, text)

	return res.send(text)
})

app.set('query parser', 'simple')

// @ts-ignore
// Global error fallback handler, including promises
app.use(async (err, req, res, next) => {
	error(err)
	const info = err && (err.stack || err.status || err.errmsg || err.message || err) || 'no error message available'
	await mail_service.send_mail(
		'error@link-archive.org',
		'API 500 / 422',
		html_escape(info))
	if (err?.[0] instanceof ValidationError) {
		return res.status(UNPROCESSABLE_ENTITY).send(err)
	}
	const user_message = 'Internal Server Error'
	// if (!is_production) // TODO revert
	//  user_message += ' - ' + info;
	return res.status(500).send(user_message)
});

(async () => {
	await createConnection()
	const PORT = Number(env('PORT'))
	const HOST = env('HOST')
	app.listen(PORT, HOST, () => log(`running on ${PORT}`))
})().catch((e) => {
	error(e)
	process.exit(1)
})
