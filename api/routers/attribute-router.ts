import { ObjectID } from 'bson';
import express from 'express';
import Attribute from '../models/Attribute';

const attribute_router = express.Router();

attribute_router.post('/', async (req, res) => {
    const { name, description, subject, unit, type } = req.body;
    const attribute = new Attribute({
        subject,
        verified: false,
        interest: 0,
        name,
        description,
        unit,
        type,
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
