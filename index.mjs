import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import MailService from './services/mail-service.mjs';
import authenticationRouter from './routers/authentication-router.mjs';
import secureRouter from './routers/secure-router.mjs';

const { log } = console;

// ///////////////// CONFIG

const MONGO_URL = process.env.MONGO_URL || (() => { throw new Error('MONGO_URL is not set'); })();
const PORT = process.env.PORT || (() => { throw new Error('PORT is not set'); })();
const MAIL_SENDER_USER = process.env.MAIL_SENDER_USER || (() => { throw new Error('MAIL_SENDER_USER is not set'); })();
const MAIL_SENDER_PASSWORD = process.env.MAIL_SENDER_PASSWORD || (() => { throw new Error('MAIL_SENDER_PASSWORD is not set'); })();
const TOKEN_SECRET = process.env.TOKEN_SECRET || (() => { throw new Error('TOKEN_SECRET is not set'); })();
const WEB_ROOT = process.env.WEB_ROOT || (() => { throw new Error('WEB_ROOT is not set'); })();

mongoose.connect(MONGO_URL);

const mailService = new MailService(MAIL_SENDER_USER, MAIL_SENDER_PASSWORD);

// ////////////////// ROUTES

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // fixme
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Token');

    next();
});
app.use('/authentication', authenticationRouter(TOKEN_SECRET, WEB_ROOT, mailService));
app.use('/secure', secureRouter(TOKEN_SECRET));
app.listen(PORT, () => {
    log('running');
});
