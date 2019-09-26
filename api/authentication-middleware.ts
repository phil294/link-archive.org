import { NextFunction, Request, Response } from 'express';
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from 'http-status-codes';
import { User } from './models/User';
import TokenService from './services/TokenService';

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

            let user_optional: User | undefined;
            // external
            if (payload.external_type && payload.external_identifier) {
                user_optional = await User.findOne({
                    external_identifier: payload.external_identifier,
                    external_type: payload.external_type,
                });
            // local (email)
            } else if (payload.email) {
                user_optional = await User.findOne({
                    email: payload.email,
                });
            } else {
                throw new Error(`${INTERNAL_SERVER_ERROR}`); // 'payload not identifiable' todo can this ever happen? would mean an invalid token generation somewhere
            }
            let user: User;
            if (!user_optional) {
                // this is a first valid token login. create account
                user = new User(payload.user);
                await user.save();
            } else {
                user = user_optional;
                if (payload.iat < user.min_iat) {
                    // min_iat had been set to disallow the given token -> All tokens had been invalidated -> Expired -> Unauthorized
                    throw new Error('The token expired');
                }
            }
            res.locals.user = user;
        } else {
            // No user specified. This is fine - functionality that requires authentication must include user-secured or admin-secured which will then handle the respective errors appropriately.
        }
        // Everything is fine
        return next();
    };
