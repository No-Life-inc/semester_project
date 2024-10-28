import Knex from "knex";
import dotenv from "dotenv";
dotenv.config();

const config: {
    development: {
        client: string;
        connection: {
            server: string;
            password: string;
            database: string;
            migrations: { extension: string; directory: string };
            seeds: { extension: string; directory: string };
            options: { encrypt: boolean; trustServerCertificate: boolean; enableArithAbort: boolean };
            user: string
        }
    }
} = {
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
