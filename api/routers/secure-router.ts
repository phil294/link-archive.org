import express from 'express';
import { UNAUTHORIZED } from 'http-status-codes';
import { default as TokenService } from '../services/token-service';
import userRouter from './secure/user-router';

export default ((tokenService: TokenService) => {
    const secureRouter = express.Router();
    /** check & set user */
    secureRouter.use(async (req, res, next) => {
        try {
            res.locals.user = await tokenService.toUser((req.headers.authorization || '').substring(7));
        } catch (error) {
            res.status(UNAUTHORIZED).send(error.message);
            return;
        }
        next();
    });
    secureRouter.get('/refreshtoken', (_, res) => {
        res.end();
    });
    secureRouter.use('/user', userRouter);
    return secureRouter;
});
