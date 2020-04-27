import { NextFunction, Request, Response } from 'express';
import { UNAUTHORIZED } from 'http-status-codes';
import { User } from './models/User';
import TokenService from './services/TokenService';
import { ObjectID } from 'mongodb';

export default (token_service: TokenService) =>
    async (req: Request, res: Response, next: NextFunction) => {
        if (req.headers.authorization) {
            // Bearer is specified. Thus, try to log in this user and stop the execution chain if something failed
            let payload;
            try {
                payload = await token_service.decode(req.headers.authorization.substring(7));
            } catch (error) {
                return res.status(UNAUTHORIZED).send(error);
            }

            if (!payload.user || !payload.user._id)
                throw new Error('Payload not identifiable.');

            const user = await User.findOne({
                _id: new ObjectID(payload.user._id),
            });
            if (!user)
                return res.status(UNAUTHORIZED).send('Specified user id not found.');

            if (payload.iat < user.min_iat) {
                // min_iat had been set to disallow the given token -> All tokens for this user had been invalidated -> Expired -> Unauthorized
                return res.status(UNAUTHORIZED).send('The token expired');
            }

            res.locals.user = user;
        } else {
            // No user specified. This is fine - functionality that requires authentication must include user-secured or admin-secured which will then handle the respective errors appropriately.
        }
        // Everything is fine
        return next();
    };
