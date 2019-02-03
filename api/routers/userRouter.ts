import express from 'express';
import user_secured from '../user_secured';

const user_router = express.Router();
user_router.patch('/', user_secured, async (req, res) => {
    const user = res.locals.user;
    [
        'min_iat', // If set, this will lead to the invalidation of all tokens prior to the date
    ].forEach((prop) => {
        if (req.body[prop])
            user[prop] = req.body[prop];
    });
    await user.save();
    res.send(user);
});

export default user_router;
