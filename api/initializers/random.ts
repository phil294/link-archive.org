import { ObjectID } from 'mongodb';
import 'reflect-metadata';
import connection from '../connection';
import Attribute from '../models/Attribute';
import Product from '../models/Product';
import { error } from '../utils';

error('Generating attributes');
const attributes = [...Array(30).keys()].map(i => (Object.assign(new Attribute(), {
    type: 'test',
    name: `attribute ${i}`,
    _id: new ObjectID('facebeefbadefaceaffeb0' + `${i}`.padStart(2, '0')), // tslint:disable-line
})));

const attributeIds = attributes.map(a => a._id.toString());

const generateRandomPrimaryProductData = () => attributeIds
    .sort(() => 0.5 - Math.random()) // random order
    .slice(0, Math.floor(Math.random() * 25)) // pick some
    .map(a => [a, Math.floor(Math.random() * 10)]) // random value 0-9
    .reduce((all, v) => ({ // make `data`
        ...all,
        [v[0]]: {
            verified: Math.random() > 0.25, // most are verified
            user: '123',
            value: v[1],
            source: 'src',
        },
    }), {});

(async () => {
    await connection;

    error('Adding dummy attributes');
    await Attribute.save(attributes);

    error('Generating dummy products');
    const products = [...Array(10000).keys()].map(i => (Object.assign(new Product(), {
        type: 'test',
        name: `product ${i}`,
        data: generateRandomPrimaryProductData(),
        _id: new ObjectID(`${i}`.padStart(24, '0')),
        verified: Math.random() > 0.1, // most are verified
    })));
    error('Adding dummy products');
    await Product.insert(products);

    error('Finished');
    process.exit(0);
})();
