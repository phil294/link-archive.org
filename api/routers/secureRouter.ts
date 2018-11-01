import express from 'express';
import { UNAUTHORIZED } from 'http-status-codes';
import { User } from '../models/User';
import TokenService from '../services/TokenService';

export default ((tokenService: TokenService) => {
    const secureRouter = express.Router();
    /** check & set user */
    secureRouter.use(async (req, res, next) => {
        try {
            res.locals.user = await tokenService.toUser((req.headers.authorization || '').substring(7));
        } catch (error) {
            res.status(UNAUTHORIZED).send(error); // todo does not send any body
            return;
        }
        next();
    });
    secureRouter.get('/', (_, res) => {
        const user: User = res.locals.user;
        res.send(`hi from secure. your id: ${user.id}`);
    });
    return secureRouter;
});
