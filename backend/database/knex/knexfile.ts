import { Knex } from 'knex';
import dotenv from 'dotenv';
dotenv.config();



const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'mssql',
        connection: {
            server: process.env.SQL_HOST || 'localhost',
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: 'BookCollection',  // Her er databasenavnet
            options: {
                encrypt: true,
                enableArithAbort: true,
                trustServerCertificate: true,
            },
        },
        migrations: {
            directory: './database/knex/migrations',  // Sørg for at denne sti er korrekt
            extension: 'ts',
        },
        seeds: {
            directory: './seeds',
            extension: 'ts',
        },
        pool: {
            min: 2,
            max: 10,
        },
    },
};

export default config;
