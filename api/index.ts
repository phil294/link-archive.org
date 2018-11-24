import bodyParser from 'body-parser';
import express from 'express';
import expressFormData from 'express-form-data';
import { NO_CONTENT } from 'http-status-codes';
import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';
import authenticationMiddleware from './authenticationMiddleware';
import authenticationRouter from './routers/authenticationRouter';
import userRouter from './routers/userRouter';
import MailService from './services/MailService';
import TokenService from './services/TokenService';

const { log, error } = console;

// ///////////////// CONFIG

/** process.env.[name] or throw */
const getEnv = (name: string): string => process.env[name] || (() => { throw new Error(`environment variable ${name} is missing`); })();

const connection: Promise<Connection> = createConnection({
    database: getEnv('MONGO_DATABASE'),
    host: getEnv('MONGO_HOST'),
    port: Number(getEnv('MONGO_PORT')),
    type: 'mongodb',
    entities: [
        `${__dirname}/models/*.ts`, // ` *
    ],
});

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
    next();
});

app.use(authenticationMiddleware(tokenService));
app.use('/authentication', authenticationRouter(
    tokenService, mailService,
    getEnv('WEB_ROOT'), getEnv('GOOGLE_CLIENT_ID'), getEnv('FACEBOOK_APP_ID'), getEnv('FACEBOOK_APP_SECRET'), getEnv('WEBSITE_NAME'),
));
app.use('/user', userRouter);

// @ts-ignore
// Global error fallback handler, including promises
app.use((err, req, res, next) => {
    error(err);
    res.status(500).send(err && err.status);
});

(async () => {
    await connection;
    const PORT = getEnv('PORT');
    app.listen(PORT, () => log(`running on ${PORT}`));
})().catch((e) => {
    error(e);
    process.exit(1);
});
