import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
    process.env.NODE_ENV === 'test' ? process.env.TEST_SQL_NAME : process.env.SQL_NAME,
    process.env.SQL_USER,
    process.env.SQL_PASSWORD,
    {
        host: process.env.SQL_HOST,
        port: process.env.SQL_PORT ? parseInt(process.env.SQL_PORT, 10) : undefined,
        dialect: "mssql",
        dialectOptions: {
            options: {
                encrypt: true,
                trustServerCertificate: true,
            },
        },
        logging: false,
    }
);

// Forbindelse til resten af applikationen (Books, Collections osv.)
export const limitedSequelize = new Sequelize(
    process.env.NODE_ENV === 'test' ? process.env.TEST_SQL_NAME : process.env.SQL_NAME,
    process.env.LIMITED_SQL_USER,
    process.env.LIMITED_SQL_PASSWORD,
    {
        host: process.env.SQL_HOST,
        port: process.env.SQL_PORT ? parseInt(process.env.SQL_PORT, 10) : undefined,
        dialect: "mssql",
        dialectOptions: {
            options: {
                encrypt: true,
                trustServerCertificate: true,
            },
        },
        logging: console.log,
    }
);


