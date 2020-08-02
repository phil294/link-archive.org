import { User } from '../models/User';

interface Locals {
    user: User;
}

/* TODO whatsup
declare module 'express' {
    // For some reason, this doesnt fix the Response object *without*
    // explicitly specifying `res: Response` in the request handler.
    // How to do this? stackoverflow.com/questions/55362741
    // Once this is fixed, all res.locals type casts in the codebase can be
    // removed
    export interface Response  {
        locals: Locals;
    }
}
// */