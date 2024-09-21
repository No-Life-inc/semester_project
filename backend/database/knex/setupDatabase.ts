// database.ts

import knex from 'knex';
import knexConfig from './knexfile';
import dotenv from 'dotenv';
dotenv.config();

const db = knex(knexConfig.development);

export async function initializeDatabase(): Promise<void> {
    try {
        console.log('Running migrations...');
        await db.migrate.latest();

        console.log('Running seeds...');
        await db.seed.run();

        console.log('Database is ready.');
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}

export default db;