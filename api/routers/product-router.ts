import express from 'express';
import adminSecured from '../adminSecured';
import Attribute from '../models/Attribute';
import Product from '../models/Product';
import { Not, In } from 'typeorm';

const productRouter = express.Router();

productRouter.post('/', (req, res) => {
    const { name } = req.body;
    const product = Object.assign(new Product(), {
        name,
        type: req.params.product,
        verified: false,
    }).save();
    res.send(product);
});

productRouter.delete('/:id', adminSecured, (req, res) => {
    // req.params.id;
});

productRouter.get('/', async (req, res) => {
    const { type, showerIds, filters, sorters, columns } = req.query;
    const extraAttributesAmount = columns - showerIds.length;
    const extraAttributeIds = (await Attribute.find({
        select: ['id'],
        where: {
            type,
            id: Not(In(showerIds)),
        },
        take: extraAttributesAmount,
        order: {
            interest: 'DESC',
        },
    })).map(attribute => attribute.id.toString());
    const sortersMissing = sorters
        .map((sorter: any) => sorter.attribute)
        .filter((attributeId: string) =>
            extraAttributeIds.includes(attributeId) &&
            showerIds.includes(attributeId));
    extraAttributeIds.splice(extraAttributeIds.length - 1 - sortersMissing.length, sortersMissing.length);
    const relevantAttributeIds = [...showerIds, ...extraAttributeIds, ...sortersMissing];
    const filtersFormatted: any = filters
        .map((filter: any) => ({ // todo define types
            attributeId: `${filter.attributeId}.value`,
            // logic... transform condition to fit typeorm
            condition: filter.condition,
            conditionValue: filter.conditionValue,
        }))
        .reduce((all: object, filter: any) => ({
            ...all,
            // todo does not allow multiple filters for the same attribute. see typeorm#2396. fix when ready.
            [filter.attributeId]: filter.conditionValue,
        }), {});
    const sortersFormatted: any = sorters
        .map((sorter: any) => ({
            attributeId: `${sorter.attributeId}.value`,
            direction: sorter.direction,
        }))
        .reduce((all: object, sorter: any) => ({
            ...all,
            [sorter.attributeId]: sorter.direction,
        }), {});

    /********** Search ***********/
    const products = await Product.find({
        where: {
            type,
            data: {
                ...filtersFormatted,
            },
        },
        select: [
            'id', 'name', 'verified', // todo
            // ...relevantAttributeIds.map(id => `data/${id}`),
            'data'
        ],
        order: {
            ...sortersFormatted
        },
    });
    res.send(products);
});

export default productRouter;
