import { NextFunction, Request, Response } from 'express';
import { UNAUTHORIZED } from 'http-status-codes';
import { User } from './models/User';

export default (_: Request, res: Response, next: NextFunction) => {
    // TODO:
    // if (!res.locals.user || res.locals.user._id.toHexString() !== User.ADMIN_ID) {
    res.status(UNAUTHORIZED).end();
    return;
    // }
    // next();
};
