import express from 'express';

const secureRouter = express.Router();
secureRouter.patch('/', (req, res) => {
    const user = res.locals.user;
    [
        'minIat', // If set, this will lead to the invalidation of all tokens prior to the date
    ].forEach((prop) => {
        if (req.body[prop])
            user[prop] = req.body[prop];
    });
    user.save();
});

export default secureRouter;
