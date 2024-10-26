import Knex from "knex";
import dotenv from "dotenv";
dotenv.config();

const config: {
    development: {
        migrations: { extension: string; directory: string };
        seeds: { extension: string; directory: string };
        pool: { min: number; max: number };
        client: string;
        connection: Knex.MsSqlConnectionConfig
    }
} = {
    development: {
        client: "mssql",
        connection: {
            server: process.env.SQL_HOST as string,
            user: process.env.SQL_USER as string,
            password: process.env.SQL_PASSWORD as string,
            database: process.env.SQL_NAME as string,
            options: {
                encrypt: true,
                enableArithAbort: true,
                trustServerCertificate: true,
            },
        } as Knex.MsSqlConnectionConfig,  // Cast til den specifikke mssql type
        migrations: {
            directory: ".migrations",
            extension: "ts",
        },
        seeds: {
            directory: ".seeds",
            extension: "ts",
        },
        pool: {
            min: 2,
            max: 10,
        },
    },
};

export default config;
