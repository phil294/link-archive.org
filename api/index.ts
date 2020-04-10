/// <reference types="./types/express-form-data" />
import bodyParser from 'body-parser';
import { ValidationError } from 'class-validator';
import express from 'express';
import expressFormData from 'express-form-data';
import { NO_CONTENT, UNPROCESSABLE_ENTITY } from 'http-status-codes';
import 'reflect-metadata';
import authentication_middleware from './authentication-middleware';
import connection from './connection';
import authentication_router from './routers/authentication-router';
import error_router from './routers/error-router';
import user_router from './routers/user-router';
import MailService from './services/MailService';
import TokenService from './services/TokenService';
import { env, error, html_escape, log } from './utils';

// ///////////////// CONFIG

const mail_service = new MailService(env('MAIL_SENDER_SMTP_HOST'), env('MAIL_SENDER_USER'), env('MAIL_SENDER_PASSWORD'));
const token_service = new TokenService(env('TOKEN_SECRET'));

// ////////////////// ROUTES

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressFormData.parse());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // fixme

    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
        res.sendStatus(NO_CONTENT);
        return;
    }
    log(req.method, req.url);
    // setTimeout(next, 150);
    next();
});

app.use(authentication_middleware(token_service));
app.use('/authentication', authentication_router(
    token_service, mail_service,
    env('WEB_ROOT'), env('GOOGLE_CLIENT_ID'), env('FACEBOOK_APP_ID'), env('FACEBOOK_APP_SECRET'), env('WEBSITE_NAME'),
));
app.use('/user', user_router);
app.use('/error', error_router(mail_service));

// @ts-ignore
// Global error fallback handler, including promises
app.use(async (err, req, res, next) => {
    error(err);
    const info = err && (err.stack || err.status || err.errmsg || err.message || err) || 'no error message available';
    await mail_service.send_mail(
        'FIXME - Insert desired error message receiving email here',
        'API 500 / 422',
        html_escape(info));
    if (err.length && (err[0] instanceof ValidationError || err[0].constraints)) { // TODO: class-validator whitelisting errors arent instanceof ValidationError. Probably a bug?
        return res.status(UNPROCESSABLE_ENTITY).send(err);
    }
    const user_message = 'Internal Server Error';
    // if (!is_production) // TODO revert
    //  user_message += ' - ' + info;
    return res.status(500).send(user_message);
});

(async () => {
    await connection;
    const PORT = env('PORT');
    app.listen(PORT, () => log(`running on ${PORT}`));
})().catch((e) => {
    error(e);
    process.exit(1);
});
