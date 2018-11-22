import express from 'express';
import { In, Not } from 'typeorm';
import adminSecured from '../adminSecured';
import Attribute from '../models/Attribute';
import Product from '../models/Product';

const productRouter = express.Router();

productRouter.post('/', (req, res) => {
    const { name, type } = req.body;
    const product = Object.assign(new Product(), {
        name,
        type,
        verified: false,
        data: {},
    }).save();
    res.send(product);
});

productRouter.delete('/:id', adminSecured, (req, res) => {
    // req.params.id;
});

productRouter.get('/', async (req, res) => {
    const { type, showerIds, filters, sorters, columns } = req.query;
    // TODO: parse above into arrays
    const extraIdsAmount = columns - showerIds.length;
    const extraIds = (await Attribute.find({
        select: ['id'],
        where: {
            type,
            id: Not(In(showerIds)),
        },
        take: extraIdsAmount,
        order: {
            interest: 'DESC',
        },
    })).map(attribute => attribute.id.toString());
    const sortersMissing = sorters
        .map((sorter: any) => sorter.attribute)
        .filter((attributeId: string) =>
            extraIds.includes(attributeId) &&
            showerIds.includes(attributeId));
    extraIds.splice(extraIds.length - 1 - sortersMissing.length, sortersMissing.length);
    const relevantAttributeIds = [...showerIds, ...extraIds, ...sortersMissing];
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
            'data',
        ],
        order: {
            ...sortersFormatted,
        },
    });
    res.send(products);
});

export default productRouter;
