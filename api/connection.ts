import { Connection, createConnection } from 'typeorm';
import { env } from './utils';

const connection: Promise<Connection> = createConnection({
    database: env('MONGO_DATABASE'),
    host: env('MONGO_HOST'),
    port: Number(env('MONGO_PORT')),
    type: 'mongodb',
    connectTimeoutMS: 10000,
    reconnectTries: 10,
    reconnectInterval: 1000,
    entities: [
        `${__dirname}/models/*.ts`, // ` *
    ],
});

export default connection;
