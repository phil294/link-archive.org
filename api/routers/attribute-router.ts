import { ObjectID } from 'bson';
import express from 'express';
import Attribute from '../models/Attribute';

const attribute_router = express.Router();

attribute_router.post('/', async (req, res) => {
    const { name, subject } = req.body;
    const attribute = Object.assign(new Attribute(), {
        name,
        subject,
        verified: false,
    });
    await attribute.save();
    res.send(attribute);
});

attribute_router.get('/', async (req, res) => {
    const subject = req.query.t;
    const attributes = await Attribute.find({
        where: {
            subject,
        },
    });
    res.send(attributes);
});

export default attribute_router;
