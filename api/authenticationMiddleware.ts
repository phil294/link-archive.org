import { NextFunction, Request, Response } from 'express';
import TokenService from './services/TokenService';

export default (tokenService: TokenService) =>
    async (req: Request, res: Response, next: NextFunction) => {
        if (req.headers.authorization) {
            try {
                const user = await tokenService.toUser((req.headers.authorization).substring(7));
                res.locals.user = user;
                res.locals.userId = user._id;
            } catch (error) {
                // todo error is status code.. ? see user class
                res.locals.userError = error;
            }
        }
        next();
    };
