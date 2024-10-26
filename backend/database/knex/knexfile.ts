import dotenv from "dotenv";
import pkg from "knex";
const { Knex } = pkg;
dotenv.config();

const config = {
    client: "mssql",
    connection: {
        server: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_NAME,
        migrations:{
            directory: "./migrations"
        },
        seeds:{
            directory: "./seeds"
        }
    },
};

export default config;
