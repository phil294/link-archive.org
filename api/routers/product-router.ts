import express from 'express';
import Product from '../models/Product';
import adminSecured from '../adminSecured';
import Attribute from '../models/Attribute';

const productRouter = express.Router();

productRouter.post('/', (req, res) => {
    const { name } = req.body;
    const product = Object.assign(new Product(), {
        name,
        type: req.params.product,
        verified: false
    }).save();
    res.send(product);
});

productRouter.delete('/:id', adminSecured, (req, res) => {
    req.params.id
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
            interest: 'DESC'
        }
    })).map(attribute => attribute.id.toString());
    const sortersMissing = sorters
        .map((sorter: any) => sorter.attribute)
        .filter((attributeId: string) =>
            extraAttributeIds.includes(attributeId) &&
            showerIds.includes(attributeId));
    extraAttributeIds.splice(extraAttributeIds.length - 1 - sortersMissing.length, sortersMissing.length)
    const relevantAttributeIds = [...showerIds, ...extraAttributeIds, ...sortersMissing]
    const filtersFormatted = filters.map(filter => ({
        attributeId: `data/${filter.attributeId}`,
        condition
    }).reduce((all, filter) => {
        if(!all[filter.attributeId])
            all[filter.attributeId] = [];
        all[filter.attributeId].push(filter.condition)
        return all;
    }, {}).map(E => or(E)); // todo

    /********** Search ***********/
    const products = await Product.find({
        where: {
            ...filtersFormatted,
        },
        select: [
            'id', 'name', 'verified', // todo
            ...relevantAttributeIds.map(id => `data/${id}`)
        ],
        order: {
            ...req.query.sorters,
        }
    })
});
export default productRouter;
