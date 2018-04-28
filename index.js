const { log } = console;
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const MONGO_URL = process.env.MONGO_URL || (() => { throw new Error('MONGO_URL is not set'); })();
const PORT = process.env.PORT || (() => { throw new Error('PORT is not set'); })();
const MAIL_SENDER_USER = process.env.MAIL_SENDER_USER || (() => { throw new Error('MAIL_SENDER_USER is not set'); })();
const MAIL_SENDER_PASSWORD = process.env.MAIL_SENDER_PASSWORD || (() => { throw new Error('MAIL_SENDER_PASSWORD is not set'); })();

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
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');

    next();
});

app.get('/requesttokenmail', (req, res) => {
    sendMail(req.query.email, 'Your Login Mail - ls', 'hi <b>bruh</b>')
        .then(res.end)
        .catch((error) => {
            res.status(500).send(error);
        });
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
