import express from 'express';
import jwt from 'jwt-simple';
import httpStatus from 'http-status-codes';
import User from '../models/user.mjs';

export default ((TOKEN_SECRET) => {
    const secureRouter = express.Router();
    /** check & set user */
    secureRouter.use(async (req, res, next) => {
        let sub;
        try {
            ({ sub } = jwt.decode(req.headers.token, TOKEN_SECRET));
        } catch (error) {
            res.status(httpStatus.UNAUTHORIZED).send(error); // todo does not send any body
            return;
        }
        let user = await User.findOne({ email: sub });
        if (!user) {
            // first valid token login with this email. create account (which does nothing important, really)
            user = await ((new User({ email: sub })).save());
        }
        res.locals.user = user;
        next();
    });
    secureRouter.get('/', (req, res) => {
        res.send(`hi from secure. your email: ${res.locals.user.email}`);
    });
    return secureRouter;
});
