import bodyParser from 'body-parser';
import express from 'express';
import expressFormData from 'express-form-data';
import { NO_CONTENT } from 'http-status-codes';
import 'reflect-metadata';
import authenticationMiddleware from './authenticationMiddleware';
import connection from './connection';
import attributeRouter from './routers/attribute-router';
import authenticationRouter from './routers/authenticationRouter';
import productRouter from './routers/product-router';
import userRouter from './routers/userRouter';
import MailService from './services/MailService';
import TokenService from './services/TokenService';
import { error, getEnv, log } from './utils';

// ///////////////// CONFIG

const mailService = new MailService(getEnv('MAIL_SENDER_SERVICE'), getEnv('MAIL_SENDER_USER'), getEnv('MAIL_SENDER_PASSWORD'));
const tokenService = new TokenService(getEnv('TOKEN_SECRET'));

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
    next();
});

app.use(authenticationMiddleware(tokenService));
app.use('/authentication', authenticationRouter(
    tokenService, mailService,
    getEnv('WEB_ROOT'), getEnv('GOOGLE_CLIENT_ID'), getEnv('FACEBOOK_APP_ID'), getEnv('FACEBOOK_APP_SECRET'), getEnv('WEBSITE_NAME'),
));
app.use('/user', userRouter);
app.use('/p', productRouter);
app.use('/a', attributeRouter);

// @ts-ignore
// Global error fallback handler, including promises
app.use((err, req, res, next) => {
    error(err);
    res.status(500).send(err && (err.status || err.errmsg));
});

(async () => {
    await connection;
    const PORT = getEnv('PORT');
    app.listen(PORT, () => log(`running on ${PORT}`));
})().catch((e) => {
    error(e);
    process.exit(1);
});
