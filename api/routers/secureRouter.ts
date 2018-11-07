import express from 'express';
import { UNAUTHORIZED } from 'http-status-codes';
import { default as TokenService } from '../services/TokenService';
import userRouter from './secure/userRouter';

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
    secureRouter.use('/user', userRouter);
    return secureRouter;
});
