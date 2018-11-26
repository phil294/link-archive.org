import express from 'express';
import userSecured from '../userSecured';

const userRouter = express.Router();
// todo patch syntax is numpties, should be application/json-patch
userRouter.patch('/', userSecured, async (req, res) => {
    const user = res.locals.user;
    [
        'minIat', // If set, this will lead to the invalidation of all tokens prior to the date
    ].forEach((prop) => {
        if (req.body[prop])
            user[prop] = req.body[prop];
    });
    await user.save();
    res.send(user);
});

export default userRouter;
