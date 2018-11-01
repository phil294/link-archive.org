import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { LoginTicket, TokenPayload } from 'google-auth-library/build/src/auth/loginticket';
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from 'http-status-codes';
import * as request from 'request-promise-native';
import { ExternalType } from '../models/User';
import MailService from '../services/MailService';
import TokenService from '../services/TokenService';

export default ((tokenService: TokenService, mailService: MailService,
                 WEB_ROOT: string, GOOGLE_CLIENT_ID: string, FACEBOOK_APP_ID: string, FACEBOOK_APP_SECRET: string, WEBSITE_NAME: string) => {
    const authenticationRouter: Router = Router();
    /** an email for login was requested. login==register */
    authenticationRouter.get('/requesttokenmail', (req, res) => {
        // todo determine if account with mail exists and give out the information to the user in the mail below. motivation: freecodecamp 180963
        // todo let user choose if he wants one-time or never-expiring token
        // todo add functionality "invalidate all tokens" (aka "log out everywhere")
        const token: string = tokenService.create({
            email: req.query.email, // validity check not necessary, nodemailer handles this
        });
        const loginUrl = `${WEB_ROOT}/#/logincallback?token=${token}`;
        const pasteUrl = `${WEB_ROOT}/#/logincallback`;
        mailService.sendMail(req.query.email, `Your Login Mail - ${WEBSITE_NAME}`, `
                    Hello, <br>
                    <br>
                    <a href="${loginUrl}" alt="login url">CLICK HERE to log in to ${WEBSITE_NAME}.</a><br>
                    <br>
                    Alternatively, you can paste the token<br>
                    ${token}<br>
                    manually here:<br>
                    <a href="${pasteUrl}" alt="paste token url">${pasteUrl}</a><br>
                    <br>
                    If your user account does not exist yet, it will be created once you log in.<br>
                    <br>
                    Bye`)
            .then(() => res.end())
            .catch((error: any) => {
                res.status(INTERNAL_SERVER_ERROR).send(error.code);
            });
    });
    /** post google token, return jwt */
    authenticationRouter.post('/googletokenlogin', async (req, res) => {
        const googleOAuth2Client = await new OAuth2Client(GOOGLE_CLIENT_ID);
        const payload: TokenPayload | undefined = await (async () => {
            let loginTicket: LoginTicket | null;
            try {
                loginTicket = await googleOAuth2Client.verifyIdToken(({ // todo can this even throw?? docs pleeeease
                    audience: GOOGLE_CLIENT_ID,
                    idToken: req.query.googletoken,
                }));
            } catch (error) {
                return undefined;
            }
            if (!loginTicket) {
                return undefined;
            }
            const payload = loginTicket.getPayload(); // tslint:disable-line:no-shadowed-variable
            if (!payload)
                return undefined;
            if (!payload.sub)
                return undefined;
            return payload;
        })();
        if (!payload) {
            res.status(UNAUTHORIZED).end();
            return;
        }
        const token = tokenService.create({
            email: payload.email,
            externalIdentifier: payload.sub,
            externalType: ExternalType.GOOGLE,
            name: payload.name,
            picture: payload.picture,
        });
        res.send(token);
    });
    /** post facebook token, return jwt */
    authenticationRouter.post('/facebooktokenlogin', async (req, res) => {
        let result = await request.get(`https://graph.facebook.com/debug_token?input_token=${req.query.facebooktoken}&access_token=${FACEBOOK_APP_ID}|${FACEBOOK_APP_SECRET}`);
        let { data } = JSON.parse(result);
        if (data.app_id !== FACEBOOK_APP_ID || !data.is_valid) {
            res.status(UNAUTHORIZED).send('Facebook says the data is not valid.');
        }
        result = await request.get(`https://graph.facebook.com/me?access_token=${req.query.facebooktoken}`);
        data = JSON.parse(result);
        const token = tokenService.create({
            externalIdentifier: data.user_id,
            externalType: ExternalType.FACEBOOK,
            name: data.name,
        });
        res.send(token);
    });
    return authenticationRouter;
});
