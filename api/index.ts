/// <reference types="./types/express-form-data" />
import bodyParser from 'body-parser'
import express, { Request } from 'express'
import expressFormData from 'express-form-data'
import { File as MultipartyFile } from 'multiparty'
import { BAD_REQUEST, NO_CONTENT, UNPROCESSABLE_ENTITY } from 'http-status-codes'
import 'reflect-metadata'
import version_check_middleware from './version-check-middleware'
import error_router from './routers/error-router'
import MailService from './services/MailService'
import { env, error, log, html_escape, is_production } from './utils'
import { promisify } from 'util'
import fs from 'fs'
import http from 'http'
import https from 'https'
import { ValidationError } from 'class-validator'
import cp from 'child_process'

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

app.use('/db', express.static('../api'))

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')

	res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-app-version')
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'GET,POST')
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

app.get('/', async (req, res) => {
	const limit = Math.min(Number(req.query.l) || 100, 500)
	let match_terms = req.query.q
	if(!match_terms)
		return res.status(BAD_REQUEST).send('query param `q` (search terms) and/or `l` (limit) missing!')
	// to avoid boring empty responses
	match_terms = (match_terms+'').replace(/[!#$%^&*()+=\-\][}{\\|/?.:;><~@]/g, ' ')
	
	const timeout = 2100

	// console.time('dbquery')
	// no idea how to better achieve sqlite process max execution timeout / interrupt calls in nodejs
	const result = await new Promise(resolve => {
		const child = cp.fork('./db_query.js', [
			match_terms+'', limit+''
		])
		const kill_child_timeout = setTimeout(() => {
			child.kill()
			resolve(null)
		}, timeout)
		child.on('message', child_result => {
			clearTimeout(kill_child_timeout)
			resolve(child_result)
		})
	})
	// console.timeEnd('dbquery')
	if(result === null) {
		console.log('-> timeout')
		return res.status(BAD_REQUEST).send('timeout')
	}
	return res.send(result)
})

app.set('query parser', 'simple')

// @ts-ignore
// Global error fallback handler, including promises
app.use(async (err, req, res, next) => {
	error(err)
	const info = err && (err.stack || err.status || err.errmsg || err.message || err) || 'no error message available'
	if(is_production) {
		await mail_service.send_mail(
			'error@link-archive.org',
			'API 500 / 422',
			html_escape(info))
	}
	if (err?.[0] instanceof ValidationError) {
		return res.status(UNPROCESSABLE_ENTITY).send(err)
	}
	let user_message = 'Internal Server Error'
	if (!is_production)
		user_message += ' - ' + info
	return res.status(500).send(user_message)
});

(async () => {
	const http_server = http.createServer(app)
	
	// http_server.listen(7070, '0.0.0.0', () => log(`running on 8080`))
	
	// /*
	http_server.listen(80, '0.0.0.0', () => log(`running on 80`))
	const private_key  = fs.readFileSync('/etc/ssl_hi/key.pem', 'utf8')
	const certificate = fs.readFileSync('/etc/ssl_hi/cert.pem', 'utf8')
	const credentials = {key: private_key, cert: certificate}
	const https_server = https.createServer(credentials, app)
	https_server.listen(443, '0.0.0.0', () => log(`running on 443`))
	// */
})().catch((e) => {
	error(e)
	process.exit(1)
})
