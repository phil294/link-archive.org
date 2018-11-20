import express from 'express';

const productRouter = express.Router();
productRouter.get('/test', (_, res) => {
    setTimeout(() =>
        res.send({
            products: [{ 1: 'v1', 2: 'v2', name: 'n1' }, { name: 'n2 3', 4: 'sfasdfasdf' }, { name: 'n3 a dfas sd', 3: 'x3', 4: 'asdf4', 7: 'sieben' }, { name: 'n3 a dfas sd', 3: 'x3', 4: 'asdf4', 7: 'sieben' }, { name: 'n3 a dfas sd', 3: 'x3', 4: 'asdf4', 7: 'sieben' }, { name: 'n3 a dfas sd', 3: 'x3', 4: 'asdf4', 7: 'sieben' }, { name: 'n3 a dfas sd', 3: 'x3', 4: 'asdf4', 7: 'sieben' }, { name: 'n3 a dfas sd', 3: 'x3', 4: 'asdf4', 7: 'sieben' }, { name: 'n3 a dfas sd', 3: 'x3', 4: 'asdf4', 7: 'sieben' }, { name: 'n3 a dfas sd', 3: 'x3', 4: 'asdf4', 7: 'sieben' }],
            extraAttributeIds: [1, 2, 3, 4, 7],
        })
    , 200);
});
export default productRouter;
