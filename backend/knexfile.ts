import Knex from "knex";
import dotenv from "dotenv";
dotenv.config();

const config: { [key: string]: Knex.Config } = {
    development: {
        client: "mssql",
        connection: {
            server: process.env.SQL_HOST,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_NAME,
            options: {
                encrypt: true,
                enableArithAbort: true,
                trustServerCertificate: true,
            },
            migrations: {
                directory: ".migrations",
                extension: "ts",
            },
            seeds: {
                directory: ".seeds",
                extension: "ts",
            },
        }
    },
};

export default config;
