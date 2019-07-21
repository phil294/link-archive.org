import { ObjectID } from 'mongodb';
import 'reflect-metadata'; // <- put this in sth global?
import connection from '../connection';
import Attribute from '../models/Attribute';
import Product from '../models/Product';
import { error } from '../utils';

(async () => {
    await connection;

    error('Adding dummy products');

    await Product.save(
        [...Array(50).keys()].map(i => (Object.assign(new Product(), {
            subject: 'test',
            name: `product ${i}`,
            /* data: {
                facebeefbadefaceaffeb004: {
                    verified: false,
                    user: '123',
                    value: 'ba',
                    source: 'src',
                },
            }, */
            _id: new ObjectID('facebeefbadefaceaffeb9' + `${i}`.padStart(2, '0')), // tslint:disable-line
        }))));

    error('Adding dummy attributes');

    await Attribute.save(
        [...Array(30).keys()].map(i => (Object.assign(new Attribute(), {
            subject: 'test',
            name: `attribute ${i}`,
            _id: new ObjectID('facebeefbadefaceaffeb0' + (i+'').padStart(2, '0')), // tslint:disable-line
        }))));

    error('Finished');
    process.exit(0);
})();
