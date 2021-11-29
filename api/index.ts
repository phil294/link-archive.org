/// <reference types="./types/express-form-data" />
import bodyParser from 'body-parser'
import { ValidationError } from 'class-validator'
import express, { Request } from 'express'
import expressFormData from 'express-form-data'
import { File as MultipartyFile } from 'multiparty'
import { NO_CONTENT, UNPROCESSABLE_ENTITY } from 'http-status-codes'
import 'reflect-metadata'
import authentication_middleware from './authentication-middleware'
import version_check_middleware from './version-check-middleware'
import authentication_router from './routers/authentication-router'
import error_router from './routers/error-router'
import user_router from './routers/user-router'
import MailService from './services/MailService'
import TokenService from './services/TokenService'
import { env, error, log, html_escape } from './utils'
import { createConnection } from 'typeorm'
import { promisify } from 'util'
import fs from 'fs'

// ///////////////// CONFIG

const mail_service = new MailService(env('MAIL_SENDER_SMTP_HOST'), env('MAIL_SENDER_USER'), env('MAIL_SENDER_PASSWORD'))
const token_service = new TokenService(env('TOKEN_SECRET'))

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
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH')
		res.sendStatus(NO_CONTENT)
		return
	}
	log(req.method, req.url)
	// setTimeout(next, 150);
	next()
})

app.use(version_check_middleware)
app.use(authentication_middleware(token_service))
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
app.use('/authentication', authentication_router(
	token_service, mail_service,
	env('WEB_ROOT'), env('GOOGLE_CLIENT_ID'), env('FACEBOOK_APP_ID'), env('FACEBOOK_APP_SECRET'), env('WEBSITE_NAME'),
))
app.use('/user', user_router)

app.set('query parser', 'simple')

// @ts-ignore
// Global error fallback handler, including promises
app.use(async (err, req, res, next) => {
	error(err)
	const info = err && (err.stack || err.status || err.errmsg || err.message || err) || 'no error message available'
	await mail_service.send_mail(
		'FIXME - Insert desired error message receiving email here',
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
