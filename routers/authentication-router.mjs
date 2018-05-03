import googleAuthLibrary from 'google-auth-library';
import express from 'express';
import httpStatus from 'http-status-codes';
import request from 'request-promise-native';
import { User, externalTypes } from '../models/user.mjs';

const { OAuth2Client } = googleAuthLibrary; // todo why doesnt this work as a named import ???

export default ((tokenService, WEB_ROOT, mailService, GOOGLE_CLIENT_ID) => {
    const authenticationRouter = express.Router();
    /** an email for login was requested. login==register. */
    authenticationRouter.get('/requesttokenmail', (req, res) => {
        const token = tokenService.create({
            email: req.query.email, // validity check not necessary
        });
        const url = `${WEB_ROOT}/#/login?token=${token}`;
        mailService.sendMail(req.query.email, 'Your Login Mail - ??', `
                    Hello, <br>
                    here is the link to log in to ??:<br>
                    <a href="${url}">${url}</a><br>
                    Or paste in the token manually:<br>
                    ${token}<br>
                    Bye`)
            .then(() => res.end())
            .catch((error) => {
                // todo analyze error and reply with fitting status code
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
            });
    });
    /** post google token, return jwt */
    authenticationRouter.post('/googletokenlogin', async (req, res) => {
        const googleOAuth2Client = await new OAuth2Client(GOOGLE_CLIENT_ID);
        let payload;
        try {
            payload = (await googleOAuth2Client.verifyIdToken(({
                idToken: req.query.googletoken,
                audience: GOOGLE_CLIENT_ID,
            }))).getPayload();
        } catch (error) {
            res.status(httpStatus.UNAUTHORIZED).send(error);
            return;
        }
        const token = tokenService.create({
            externalType: externalTypes.GOOGLE,
            externalIdentifier: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
        });
        res.send(token);
    });
    /** post facebook token, return jwt */
    authenticationRouter.post('/facebooktokenlogin', async (req, res) => {
        const result = await request.get(`https://graph.facebook.com/me?access_token=${req.query.facebooktoken}`);


        // const token = makeToken(email);
        // res.send(token);
        res.end();
    });
    return authenticationRouter;
});
