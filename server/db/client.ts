import {Connection, createConnection} from 'mysql2/promise';
import logger from '../utils/logger';

let connection: Connection;

export const getConnection = async () => {
    try {
        if (!connection) {
            connection = await createConnection({
                host: process.env.MYSQL_HOST,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DATABASE,
                port: 3306,
            });
        }
        return connection;
    } catch (error) {
        logger.error('Error connecting to mysql: ', error);
        return undefined;
    }
}