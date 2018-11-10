import express from 'express';

const productRouter = express.Router();
productRouter.get('/test', (_, res) => {
    setTimeout(() =>
        res.send([{ 1: 'v1', 2: 'v2', name: 'n1' }, { name: 'n2' }, { name: 'n3', 3: 'x3' }])
    , 1000);
});
export default productRouter;
