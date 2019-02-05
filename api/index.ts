import bodyParser from 'body-parser';
import express from 'express';
import expressFormData from 'express-form-data';
import { NO_CONTENT } from 'http-status-codes';
import 'reflect-metadata';
import authentication_middleware from './authentication-middleware';
import connection from './connection';
import attribute_router from './routers/attribute-router';
import product_router from './routers/product-router';
import authentication_router from './routers/authentication-router';
import user_router from './routers/user-router';
import MailService from './services/MailService';
import TokenService from './services/TokenService';
import { env, error, log } from './utils';

// ///////////////// CONFIG

const mail_service = new MailService(env('MAIL_SENDER_SERVICE'), env('MAIL_SENDER_USER'), env('MAIL_SENDER_PASSWORD'));
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
    setTimeout(next, 150);
    next();
});

app.use(authentication_middleware(token_service));
app.use('/authentication', authentication_router(
    token_service, mail_service,
    env('WEB_ROOT'), env('GOOGLE_CLIENT_ID'), env('FACEBOOK_APP_ID'), env('FACEBOOK_APP_SECRET'), env('WEBSITE_NAME'),
));
app.use('/user', user_router);
app.use('/p', product_router);
app.use('/a', attribute_router);

// @ts-ignore
// Global error fallback handler, including promises
app.use((err, req, res, next) => {
    error(err);
    res.status(500).send(err && (err.status || err.errmsg));
});

(async () => {
    await connection;
    const PORT = env('PORT');
    app.listen(PORT, () => log(`running on ${PORT}`));
})().catch((e) => {
    error(e);
    process.exit(1);
});
