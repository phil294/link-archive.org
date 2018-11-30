import { ObjectID } from 'bson';
import express from 'express';
import Attribute from '../models/Attribute';

const attributeRouter = express.Router();

attributeRouter.post('/', async (req, res) => {
    const { name, type } = req.body;
    const attribute = Object.assign(new Attribute(), {
        name,
        type,
        verified: false,
    });
    await attribute.save();
    res.send(attribute);
});

attributeRouter.get('/', async (req, res) => {
    const type = req.query.t;
    let attributes = await Attribute.find({
        where: {
            type,
        },
    });
    if (!attributes.length) {
        attributes = await Attribute.save(
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (Object.assign(new Attribute(), {
                type,
                name: `attribute ${i}`,
            }))));
    }
    res.send(attributes);
});

export default attributeRouter;
