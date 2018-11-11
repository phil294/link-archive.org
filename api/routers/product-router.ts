import express from 'express';

const productRouter = express.Router();
productRouter.get('/test', (_, res) => {
    setTimeout(() =>
        res.send({
            products: [{ 1: 'v1', 2: 'v2', name: 'n1' }, { name: 'n2', 4: 'sfasdfasdf' }, { name: 'n3', 3: 'x3', 4: 'asdf4', 7: 'sieben' }],
            extraAttributes: [1, 2, 3, 4, 7],
        })
    , 1000);
});
export default productRouter;
