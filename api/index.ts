import bodyParser from 'body-parser';
import express from 'express';
import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';
import authenticationRouter from './routers/authenticationRouter';
import secureRouter from './routers/secureRouter';
import MailService from './services/MailService';
import TokenService from './services/TokenService';

const { log, error } = console;

// ///////////////// CONFIG

/** process.env.[name] or throw */
const getEnv = (name: string): string => {
    return process.env[name] || (() => { throw new Error(`environment variable ${name} is missing`); })();
};

const connection: Promise<Connection> = createConnection({
    database: getEnv('MONGO_DATABASE'),
    host: getEnv('MONGO_HOST'),
    port: Number(getEnv('MONGO_PORT')),
    type: 'mongodb',
});

const mailService = new MailService(getEnv('MAIL_SENDER_SERVICE'), getEnv('MAIL_SENDER_USER'), getEnv('MAIL_SENDER_PASSWORD'));
const tokenService = new TokenService(getEnv('TOKEN_SECRET'));

// ////////////////// ROUTES

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // fixme
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    if (req.method === 'OPTIONS') { // todo is this the way to go ??
        res.sendStatus(204);
        return;
    }
    next();
});
app.use('/authentication', authenticationRouter(
    tokenService, mailService,
    getEnv('WEB_ROOT'), getEnv('GOOGLE_CLIENT_ID'), getEnv('FACEBOOK_APP_ID'), getEnv('FACEBOOK_APP_SECRET'), getEnv('WEBSITE_NAME'),
));
app.use('/secure', secureRouter(tokenService));

app.get('/test', (_, res) => {
    res.send({ x: 'y' });
});

(async () => {
    await connection;
    app.listen(getEnv('PORT'), () => log('running'));
})().catch((e) => {
    error(e);
    process.exit(1);
});
