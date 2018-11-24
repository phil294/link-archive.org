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
    let { type, showerIdsParam, filtersParam, sortersParam, columns } = req.query;
    
    /*********** parse  *********/
    const showerIds = showerIdsParam
        .split(',')
    const sortersFormatted = sortersParam
        .split(',')
        .map((s: string) => {
            const split = s.split(':')
            return {
                attributeId: `${split[0]}.value`,
                direction: split[1],
            }
        })
        .reduce((all: object, sorter: any) => ({
            ...all,
            [sorter.attributeId]: sorter.direction,
        }), {});
    const filtersFormatted = filtersParam
        .split(',')
        .map((s: string) => {
            const split = s.split(':')
            return {
                attributeId: `${split[0]}.value`,
                condition: split[1],
                conditionValue: split[2],
            }})
        .reduce((all: object, filter: any) => ({
            ...all,
            // todo does not allow multiple filters for the same attribute. see typeorm#2396. fix when ready.
            [filter.attributeId]: filter.conditionValue,
        }), {});
    
    /*********** determine extraIds **********/
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
    
    /************ compute *************/
    const sortersMissing = sorters
        .map((sorter: any) => sorter.attribute)
        .filter((attributeId: string) =>
            !extraIds.includes(attributeId) &&
            !showerIds.includes(attributeId));
    extraIds.splice(extraIds.length - 1 - sortersMissing.length, sortersMissing.length);
    const relevantAttributeIds = [...showerIds, ...extraIds, ...sortersMissing];

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
