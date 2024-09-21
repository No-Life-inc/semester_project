import { Knex } from 'knex';
import dotenv from 'dotenv';
dotenv.config();



const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'mssql',
        connection: {
            server: process.env.SQL_HOST,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_NAME || 'bookCollection',
            options: {
                encrypt: true,
                enableArithAbort: true,
                trustServerCertificate: true,
            },
        },
        migrations: {
            directory: './database/knex/migrations',
            extension: 'ts',
        },
        seeds: {
            directory: './database/knex/seeds',
            extension: 'ts',
        },
        pool: {
            min: 2,
            max: 10,
        },
    },
};

export default config;
