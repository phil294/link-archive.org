import express from 'express';
import { INTERNAL_SERVER_ERROR, NOT_FOUND, UNPROCESSABLE_ENTITY } from 'http-status-codes';
import { ObjectID } from 'mongodb';
import { FindOptionsOrder } from 'typeorm';
import admin_secured from '../admin-secured';
import Attribute, { AttributeType } from '../models/Attribute';
import PrimaryProductDatum from '../models/PrimaryProductDatum';
import Product from '../models/Product';
import ProductDatum from '../models/ProductDatum';
import ProductDatumProposal from '../models/ProductDatumProposal';

const product_router = express.Router();

product_router.post('/', async (req, res) => {
    const { name, subject } = req.body;
    const product = new Product({
        name,
        subject,
        verified: false,
        data: {},
    });
    await product.save();
    res.send(product);
});

product_router.delete('/:id', admin_secured, async (req, res) => {
    res.send(await Product.delete({
        _id: new ObjectID(req.params._id),
    }));
});

/** Propose a ProductDatum */
product_router.post('/:product_id/data/:attribute_id', async (req, res) => {
    const { product_id, attribute_id } = req.params;
    const { value: input_value, source } = req.body;
    const attribute = await Attribute.findOne({ _id: new ObjectID(attribute_id) });
    if (!attribute) {
        return res.status(NOT_FOUND).send('Attribute not found');
    }
    const product_obj_id = new ObjectID(product_id);
    const product = await Product.findOne({
        where: { _id: product_obj_id },
        // select: [ `data.${attribute_id}` ] // todo
    });
    if (!product) {
        return res.status(NOT_FOUND).send('Product not found');
    }

    // value validation //////
    let value: AttributeType = input_value;
    if (attribute.type === 'string') {
        if (typeof input_value !== 'string' && input_value !== null) {
            return res.status(UNPROCESSABLE_ENTITY).send(`Wrong type: Expected 'string' or 'null', got '${typeof input_value}'!`);
        }
        if (!input_value.length) {
            return res.status(UNPROCESSABLE_ENTITY).send('Missing value!');
        }
    } else if (attribute.type === 'boolean') {
        if (input_value == null || input_value === 'off' || input_value === false) {
            value = false;
        } else {
            value = true;
        }
    } else if (attribute.type === 'number') {
        if (attribute.float) {
            value = Number.parseFloat(input_value);
        } else {
            value = Number.parseInt(input_value); // tslint:disable-line radix - Generously accept dec and 0xhex
        }
        if (Number.isNaN(value)) {
            return res.status(UNPROCESSABLE_ENTITY).send(`Value '${input_value}' cannot be parsed as a number!`);
        }
        if (attribute.min != null && value < attribute.min || attribute.max != null && value > attribute.max) {
            return res.status(UNPROCESSABLE_ENTITY).send(`Value '${value}' is outside the allowed boundaries: min: ${attribute.min}, max: ${attribute.max}.`);
        }
    }

    const datum = {
        value,
        source,
        user: res.locals.user_id,
    };
    const datum_proposal = new ProductDatumProposal({ // todo shouldnt these be asking for T aka the attribute type?
        ...datum,
        // @ts-ignore fixme adjust to objectid
        attribute: attribute._id,
        // @ts-ignore fixme adjust to objectid
        product: product._id,
    });
    const primary_datum = new PrimaryProductDatum({
        ...datum,
    });

    await datum_proposal.save();

    // todo same as below
    if (!product.data) {
        product.data = {};
    }
    if (!product.data[attribute_id]) {
        product.data[attribute_id] = primary_datum;
        await product.save();
        // todo which one?  what if product select todo is active?
        /*await Product.update({
            _id: product_obj_id,
        }, {
            [`data.${attribute_id}`]: primary_datum,
        });*/
    }
    return res.send(datum_proposal);
});

interface ISorter {
    attribute_id: string;
    direction: number;
}
interface IFilter {
    attribute_id: string;
    condition: string;
    condition_value: string;
}
type IMongoFilterArray = Array<{[key: string]: any}>;

// todo types missing everywhere
// todo probably should be using graphql
product_router.get('/', async (req, res) => {
    /*********** parse  *********/
    const subject: string = req.query.t;
    let shower_ids: string[] = req.query.sh
        .split(',').filter(Boolean);
    const sorters_param: string = req.query.so;
    const sorters: ISorter[] = sorters_param
        .split(',').filter(Boolean)
        .map((s: string): ISorter => {
            const split = s.split(':');
            return {
                attribute_id: split[0],
                direction: Number(split[1]),
            };
        });
    const sorters_formatted: FindOptionsOrder<Product> = sorters
        .map((sorter): ISorter => ({
            attribute_id: `data.${sorter.attribute_id}.value`,
            direction: Number(sorter.direction), // todo#a1: mongo treats empty as the smallest value. NULLS LAST does not exist
        }))
        .reduce((all: object, sorter) => ({
            ...all,
            [sorter.attribute_id]: sorter.direction,
        }), {});
    const filter_param: string = req.query.f;
    const filters_formatted: IMongoFilterArray = filter_param
        .split(',').filter(Boolean)
        .map((s: string): IFilter => {
            const [attribute_id, condition, condition_value] = s.split(':');
            return {
                attribute_id, condition, condition_value,
            };
        })
        .map((filter) => {
            let filter_condition_formatted;
            switch (filter.condition) {
            case 'lt':
                filter_condition_formatted = { $lt: filter.condition_value }; break;
            case 'gt':
                filter_condition_formatted = { $gt: filter.condition_value }; break;
            case 'nu':
                filter_condition_formatted = { $exists: false }; break;
            case 'nn':
                filter_condition_formatted = { $exists: true }; break;
            case 'ne':
                filter_condition_formatted = { $ne: filter.condition_value }; break;
            case 'eq':
            default:
                filter_condition_formatted = filter.condition_value; break;
            }
            return { [`data.${filter.attribute_id}.value`]: filter_condition_formatted };
        });

    /*********** determine showers if not given **********/
    if (!shower_ids.length) {
        const count: number = Number(req.query.c);
        shower_ids = (await Attribute.find({
            select: ['_id'],
            where: {
                subject,
            },
            take: count,
            order: {
                interest: 'DESC',
            },
        }))
        .map((attribute: Attribute) => attribute._id.toString());
    }

    /************ compute *************/
    const shower_ids_formatted = shower_ids.map(id => `data.${id}`) as Array<(keyof Product)>;

    /********** Search ***********/
    /* this is only a temporary solution because too slow for very big data.
    indices make no sense either because attributes are dynamic.
    -> todo: implement "cache" quickselect sql tables for find() that contains
    only verified values (maybe change verified to stage: integer or maaaaybe
    add _verified value columns also, or boi im lost). each product
    gets its own table. this allows for beautiful clustering. will also allow
    for #a1 to be fixed. to see findoptions way of doing it, see commit before
    17th dec 18.
    and update it accordingly. mongodb structure stays to look up product data
    like user, time, interest. also used for product data proposal managment.
    nosql feels right here because dynamic amount of attributes and values
    are of dynamic type (however same at same attribute (?))
    but keeping this without quickselect-cache for the moment until website
    explodes in popularity (which it of course will. goes without saying. :p)
    */
    const products = await Product.find({
        where: {
            $and: [
                { subject },
                ...filters_formatted,
            ],
        } as any,
        select: [
            '_id', 'name', 'verified', // todo select doesnt work at all (?) https://github.com/typeorm/typeorm/pull/3756 edit only if no default values in class/constructor (?)
            ...shower_ids_formatted,
        ],
        order: {
            ...sorters_formatted,
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
        shower_ids, // maybe as seperate request?
    });
});

export default product_router;
