import express from 'express';
import adminSecured from '../adminSecured';
import Attribute from '../models/Attribute';
import Product from '../models/Product';

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
    const { showerIds, filters, sorters, columns } = req.query;
    const extraAttributesAmount = columns - showerIds.length;
    const extraAttributeIds = (await Attribute.find({
        select: ['id'],
        where: {
            id: showerIds, // not in
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
            [filter.attributeId]: filter.condition, // todo does not allow multiple filters for the same attribute. see typeorm#2396. fix when ready.
        }), {});

    /********** Search ***********/
    const products = await Product.find({
        where: {
            data: {
                ...filtersFormatted,
            },
        },
        select: [
            'id', 'name', 'verified', // todo
            // ...relevantAttributeIds.map(id => `data/${id}`),
        ],
        order: {
            ...req.query.sorters, // obj
        },
    });
});

export default productRouter;
