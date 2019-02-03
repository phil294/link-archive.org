import { NextFunction, Request, Response } from 'express';
import TokenService from './services/TokenService';

export default (token_service: TokenService) =>
    async (req: Request, res: Response, next: NextFunction) => {
        if (req.headers.authorization) {
            try {
                const user = await token_service.to_user((req.headers.authorization).substring(7));
                res.locals.user = user;
                res.locals.user_id = user._id;
            } catch (error) {
                // todo error is status code.. ? see user class
                res.locals.user_error = error;
            }
        }
        next();
    };
