import express from 'express';
import jwt from 'jwt-simple';
import httpStatus from 'http-status-codes';

export default ((TOKEN_SECRET, WEB_ROOT, mailService) => {
    const authenticationRouter = express.Router();
    /** an email for login was requested. login==register. */
    authenticationRouter.get('/requesttokenmail', (req, res) => {
        const now = Date.now() / 1000;
        const token = jwt.encode({
            iat: now,
            // exp: (Date.now() / 1000) + 3600,
            sub: req.query.email,
        }, TOKEN_SECRET);
        const url = `${WEB_ROOT}/#/login?token=${token}`;
        mailService.sendMail(req.query.email, 'Your Login Mail - ??', `
                    Hello, <br>
                    here is the link to log in to ??:<br>
                    <a href="${url}">${url}</a><br>
                    Or past in the token manually:<br>
                    ${token}<br>
                    Bye`)
            .then(() => res.end())
            .catch((error) => {
                // todo analyze error and reply with fitting status code
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
            });
    });
    return authenticationRouter;
});
