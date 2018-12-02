import express from 'express';
import { NOT_FOUND, UNPROCESSABLE_ENTITY } from 'http-status-codes';
import { ObjectID } from 'mongodb';
import { FindOptionsOrder, FindOptionsWhere, FindOptionsWhereCondition, In, Not } from 'typeorm';
import adminSecured from '../adminSecured';
import Attribute from '../models/Attribute';
import PrimaryProductDatum from '../models/PrimaryProductDatum';
import Product from '../models/Product';
import ProductDatum from '../models/ProductDatum';
import ProductDatumProposal from '../models/ProductDatumProposal';

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

productRouter.delete('/:id', adminSecured, async (req, res) => {
    return await Product.delete({
        _id: new ObjectID(req.params._id),
    });
});

/** Propose a ProductDatum */
productRouter.post('/:productId/data/:attributeId', async (req, res) => {
    const { productId, attributeId } = req.params;
    const { value, source } = req.body;
    const attribute = await Attribute.findOne({ _id: new ObjectID(attributeId) });
    if (!attribute) {
        res.status(NOT_FOUND).send('Attribute not found');
        return;
    }
    const productObjId = new ObjectID(productId);
    const product = await Product.findOne({
        where: { _id: productObjId },
        // select: [ `data.${attributeId}` ] // todo
    });
    if (!product) {
        res.status(NOT_FOUND).send('Product not found');
        return;
    }
    const datum = Object.assign(new ProductDatum(), {
        value, // todo validation? various places. typeorm?
        source,
        user: res.locals.userId,
    });
    const datumProposal = Object.assign(new ProductDatumProposal(), {
        ...datum,
        attribute: attribute._id,
        product: product._id,
    });
    const primaryDatum = Object.assign(new PrimaryProductDatum(), {
        ...datum,
    });

    try {
        await datumProposal.save();
    } catch (e) {
        res.status(UNPROCESSABLE_ENTITY).send(e.message);
        return;
    }

    // todo same as below
    if (!product.data) {
        product.data = {};
    }
    if (!product.data[attributeId]) {
        product.data[attributeId] = primaryDatum;
        // await product.save(); // s typeorm#3184 todo
        // todo which one?  what if product select todo is active?
        //  todo coffee remove all returns
        await Product.update({
            _id: productObjId,
        }, {
            [`data.${attributeId}`]: primaryDatum,
        });
    }
    res.send(datumProposal);
});

interface ISorter {
    attributeId: string;
    direction: number;
}
interface IFilter {
    attributeId: string;
    condition: string;
    conditionValue: string;
}

// todo types missing everywhere
productRouter.get('/', async (req, res) => {
    /*********** parse  *********/
    const type: string = req.query.t;
    const showerIds: string[] = req.query.sh
        .split(',').filter(Boolean);
    const sortersParam: string = req.query.so;
    const sorters: ISorter[] = sortersParam
        .split(',').filter(Boolean)
        .map((s: string): ISorter => {
            const split = s.split(':');
            return {
                attributeId: split[0],
                direction: Number(split[1]),
            };
        });
    const sortersFormatted: FindOptionsOrder<Product> = sorters
        .map((sorter): ISorter => ({
            attributeId: `data.${sorter.attributeId}.value`,
            direction: Number(sorter.direction),
        }))
        .reduce((all: object, sorter) => ({
            ...all,
            [sorter.attributeId]: sorter.direction,
        }), {});
    const filterParam: string = req.query.f;
    const filtersFormatted: FindOptionsWhere<Product> = filterParam
        .split(',').filter(Boolean)
        .map((s: string): IFilter => {
            const split = s.split(':');
            const [attributeId, condition, conditionValue] = split;
            return {
                attributeId, condition, conditionValue,
            };
        })
        .reduce((all: object, filter: any) => ({
            ...all,
            // todo does not allow multiple filters for the same attribute. see typeorm#2396. fix when ready.
            [`data.${filter.attributeId}.value`]: filter.conditionValue, // <- typeof FindOptionsWhereCondition<Product>. join with And() ^
        }), {});

    /*********** determine extraIds **********/
    const countParam: string = req.query.c;
    const extraIdsAmount: number = Number(countParam) - showerIds.length;
    const extraIds: string[] = (await Attribute.find({
        select: ['_id'],
        where: {
            type,
            _id: Not(In(showerIds)),
        },
        take: extraIdsAmount,
        order: {
            interest: 'DESC',
        },
    })).map(attribute => attribute._id.toString());

    /************ compute *************/
    const sortersMissing: string[] = sorters
        .map(sorter => sorter.attributeId)
        .filter(attributeId =>
            !extraIds.includes(attributeId) &&
            !showerIds.includes(attributeId));
    extraIds.splice(extraIds.length - 1 - sortersMissing.length, sortersMissing.length);
    const relevantAttributeIds = [...showerIds, ...extraIds, ...sortersMissing];
    const relevantsFormatted = relevantAttributeIds.map(id => `data.${id}`) as Array<(keyof Product)>;

    /********** Search ***********/
    const products = await Product.find({
        where: {
            type,
            ...filtersFormatted,
        },
        select: [
            '_id', 'name', 'verified', // todo
            ...relevantsFormatted,
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
