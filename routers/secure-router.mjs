import httpStatus from 'http-status-codes';
import express from 'express';

export default ((tokenService) => {
    const secureRouter = express.Router();
    /** check & set user */
    secureRouter.use(async (req, res, next) => {
        try {
            res.locals.user = await tokenService.toUser(req.headers.authorization.substring(7));
        } catch (error) {
            res.status(httpStatus.UNAUTHORIZED).send(error); // todo does not send any body
            return;
        }
        next();
    });
    secureRouter.get('/', (req, res) => {
        res.send(`hi from secure. your email: ${res.locals.user.email}`);
    });
    return secureRouter;
});
