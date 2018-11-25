import express from 'express';
import { In, Not } from 'typeorm';
import adminSecured from '../adminSecured';
import Attribute from '../models/Attribute';
import Product from '../models/Product';

const productRouter = express.Router();

productRouter.post('/', async (req, res) => {
    const { name, type } = req.body;
    const product = Object.assign(new Product(), {
        name,
        type,
        verified: false,
        data: {},
    });
    await product.save();
    res.send(product);
});

productRouter.delete('/:id', adminSecured, (req, res) => {
    // req.params.id;
});

// todo types missing everywhere
productRouter.get('/', async (req, res) => {
    /*********** parse  *********/
    const type = req.query.t;
    const showerIds = req.query.sh
        .split(',').filter(Boolean);
    const sorters = req.query.so
        .split(',').filter(Boolean)
        .map((s: string) => {
            const split = s.split(':');
            return {
                attributeId: split[0],
                direction: split[1],
            };
        });
    const sortersFormatted = sorters
        .map((sorter: any) => ({
            attributeId: `data.${sorter.attributeId}.value`,
            direction: Number(sorter.direction),
        }))
        .reduce((all: object, sorter: any) => ({
            ...all,
            [sorter.attributeId]: sorter.direction,
        }), {});
    const filtersFormatted = req.query.f
        .split(',').filter(Boolean)
        .map((s: string) => {
            const split = s.split(':');
            return {
                attributeId: `${split[0]}.value`,
                condition: split[1],
                conditionValue: split[2],
            };
        })
        .reduce((all: object, filter: any) => ({
            ...all,
            // todo does not allow multiple filters for the same attribute. see typeorm#2396. fix when ready.
            [filter.attributeId]: filter.conditionValue,
        }), {});

    /*********** determine extraIds **********/
    const extraIdsAmount = req.query.c - showerIds.length;
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
    // todo fix this with typeorm (idk)
    products.forEach((p: Product) => {
        if (!p.data) {
            p.data = {};
        }
    });

    /********** return **********/
    res.send({
        products,
        extraIds,
    });
});

export default productRouter;
