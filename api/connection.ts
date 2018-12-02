import { Connection, createConnection } from 'typeorm';
import { getEnv } from './utils';

const connection: Promise<Connection> = createConnection({
    database: getEnv('MONGO_DATABASE'),
    host: getEnv('MONGO_HOST'),
    port: Number(getEnv('MONGO_PORT')),
    type: 'mongodb',
    entities: [
        `${__dirname}/models/*.ts`, // ` *
    ],
});

export default connection;
