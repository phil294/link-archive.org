const { log } = console;
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const jwt = require('jwt-simple');

const MONGO_URL = process.env.MONGO_URL || (() => { throw new Error('MONGO_URL is not set'); })();
const PORT = process.env.PORT || (() => { throw new Error('PORT is not set'); })();
const MAIL_SENDER_USER = process.env.MAIL_SENDER_USER || (() => { throw new Error('MAIL_SENDER_USER is not set'); })();
const MAIL_SENDER_PASSWORD = process.env.MAIL_SENDER_PASSWORD || (() => { throw new Error('MAIL_SENDER_PASSWORD is not set'); })();
const TOKEN_SECRET = process.env.TOKEN_SECRET || (() => { throw new Error('TOKEN_SECRET is not set'); })();
const WEB_ROOT = process.env.WEB_ROOT || (() => { throw new Error('WEB_ROOT is not set'); })();

mongoose.connect(MONGO_URL);

const nodemailerTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: MAIL_SENDER_USER,
        pass: MAIL_SENDER_PASSWORD,
    },
});

const sendMail = (recepient, subject, bodyHtml) =>
    nodemailerTransport.sendMail({
        from: MAIL_SENDER_USER,
        to: recepient,
        subject,
        html: bodyHtml,
    });

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // fixme
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Token');

    next();
});

app.get('/requesttokenmail', (req, res) => {
    const now = Date.now() / 1000;
    const token = jwt.encode({
        iat: now,
        // exp: (Date.now() / 1000) + 3600,
        email: req.query.email,
    }, TOKEN_SECRET);
    const url = `${WEB_ROOT}/#/login?token=${token}`;
    sendMail(req.query.email, 'Your Login Mail - ??', `
    Hello, <br>
    here is the link to log in to ??:<br>
    <a href="${url}">${url}</a><br>
    Bye`)
        .then(() => res.end())
        .catch((error) => {
            res.status(500).send(error);
        });
});

app.get('/secure', (req, res) => {
    const { email } = jwt.decode(req.headers.token, TOKEN_SECRET);
    res.send(email);
});

app.listen(PORT, () => {
    log('running');
});

/*
const reply = res => (err, resource) => {
    if (err) {
        error(err);
        res.status(599).send(err); // todo status bla kb
        return;
    }
    res.json(resource);
};
 // no auth:
const defaultCrudRoutes = (app, MongooseModel, resourceName) => {
    app.post(`/${resourceName}`, (req, res) => new MongooseModel(req.body).save(reply(res)));
    app.get(`/${resourceName}`, (req, res) => MongooseModel.find(reply(res)));
    app.get(`/${resourceName}/:id`, (req, res) => MongooseModel.findById(req.params.id, reply(res)));
    app.put(`/${resourceName}/:id`, (req, res) => new MongooseModel(req.body).save(reply(res)));
    app.delete(`/${resourceName}/:id`, (req, res) => MongooseModel.remove({ _id: req.params.id }, reply(res)));
}; */
