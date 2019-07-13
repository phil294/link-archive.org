import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { LoginTicket, TokenPayload } from 'google-auth-library/build/src/auth/loginticket';
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from 'http-status-codes';
import * as request from 'request-promise-native';
import { ExternalType } from '../models/User';
import MailService from '../services/MailService';
import TokenService from '../services/TokenService';
import user_secured from '../user-secured';

export default ((token_service: TokenService, mail_service: MailService,
                 WEB_ROOT: string, GOOGLE_CLIENT_ID: string, FACEBOOK_APP_ID: string, FACEBOOK_APP_SECRET: string, WEBSITE_NAME: string) => {
    const authentication_router: Router = Router();
    /** an email for login was requested. login==register */
    authentication_router.get('/requesttokenmail', (req, res) => {
        // todo determine if account with mail exists and give out the information to the user in the mail below. motivation: freecodecamp 180963
        // todo let user choose if he wants one-time or never-expiring token
        const token: string = token_service.create({
            email: req.query.email, // validity check not necessary, nodemailer handles this
        });
        const login_url = `${WEB_ROOT}/logincallback?token=${token}`;
        const paste_url = `${WEB_ROOT}/logincallback`;
        mail_service.send_mail(req.query.email, `Your Login Mail - ${WEBSITE_NAME}`, `
                    Hello, <br>
                    <br>
                    <a href="${login_url}" alt="login url">click here to log in to ${WEBSITE_NAME}.</a><br>
                    <br>
                    Alternatively, you can paste the token<br>
                    ${token}<br>
                    manually here:<br>
                    <a href="${paste_url}" alt="paste token url">${paste_url}</a><br>
                    <br>
                    If your user account does not exist yet, it will be created once you log in.<br>
                    <br>
                    Bye`)
            .then(() => res.end())
            .catch((error: any) => {
                res.status(INTERNAL_SERVER_ERROR).send('Internal mail sending error');
            });
    });
    /** post google token, return jwt */
    authentication_router.post('/googletokenlogin', async (req, res) => {
        const google_oAuth2Client = await new OAuth2Client(GOOGLE_CLIENT_ID);
        let payload: TokenPayload | undefined;
        try {
            const login_ticket: LoginTicket | null = await google_oAuth2Client.verifyIdToken(({ // todo can this even throw?? docs pleeeease
                audience: GOOGLE_CLIENT_ID,
                idToken: req.query.token,
            }));
            if (login_ticket) {
                payload = login_ticket.getPayload();
            }
        } catch (error) {/* payload could not be determined */}
        if (!payload) {
            res.status(UNAUTHORIZED).end();
            return;
        }
        if (!payload.sub) {
            res.status(INTERNAL_SERVER_ERROR).send('Could not get google user ID');
            return;
        }
        const token = token_service.create({
            email: payload.email,
            external_identifier: payload.sub,
            external_type: ExternalType.GOOGLE,
            name: payload.name,
            picture: payload.picture,
        });
        res.send(token);
    });
    /** post facebook token, return jwt */
    authentication_router.post('/facebooktokenlogin', async (req, res) => {
        let result = await request.get(`https://graph.facebook.com/debug_token?input_token=${req.query.token}&access_token=${FACEBOOK_APP_ID}|${FACEBOOK_APP_SECRET}`);
        let { data } = JSON.parse(result);
        if (data.app_id !== FACEBOOK_APP_ID || !data.is_valid) {
            return res.status(UNAUTHORIZED).send('Facebook says the data is not valid.');
        }
        result = await request.get(`https://graph.facebook.com/me?access_token=${req.query.token}`);
        data = JSON.parse(result);
        if (!data.id) {
            res.status(INTERNAL_SERVER_ERROR).send('Could not get user ID');
            return;
        }
        const token = token_service.create({
            external_identifier: data.id,
            external_type: ExternalType.FACEBOOK,
            name: data.name,
        });
        return res.send(token);
    });
    authentication_router.get('/refreshtoken', user_secured, (_, res) => {
        const token: string = token_service.create({ ...res.locals.user });
        res.send(token);
    });
    return authentication_router;
});
