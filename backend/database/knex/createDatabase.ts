import knex from 'knex';  // Importér knex-funktionen
import { Knex } from 'knex';  // Importér typen Knex til typesikkerhed
import dotenv from 'dotenv';
dotenv.config();

const config: Knex.Config = {
    client: 'mssql',
    connection: {
        server: process.env.SQL_HOST || 'localhost',
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        options: {
            encrypt: true,
            enableArithAbort: true,
        },
    },
};

// Opret databaseforbindelse og returnér en Knex instans
async function setupDatabase(): Promise<knex> {
    const initialDb = knex(config);
    const databaseName = 'BookCollection';
    console.log("Checking if setupDatabase is being called...")

    // Tjek om databasen eksisterer ved at køre en SQL-forespørgsel
    try {
        // Tjek om databasen eksisterer ved at køre en SQL-forespørgsel
        const result = await initialDb.raw(`SELECT name FROM sys.databases WHERE name = ?`, [databaseName]);

        if (result.recordset.length === 0) {  // Hvis databasen ikke findes
            await initialDb.raw(`CREATE DATABASE ${databaseName}`);
            console.log(`Database ${databaseName} created!`);
        } else {
            console.log(`Database ${databaseName} already exists.`);
        }
    } catch (err) {
        console.error('Error checking or creating database:', err);
        throw err;
    } finally {
        await initialDb.destroy();  // Sørg for at lukke forbindelsen til den generiske database
    }

    const newConfig: Knex.Config = {
        client: 'mssql',
        connection: {
            server: process.env.SQL_HOST || 'localhost',
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: databaseName, // Peger på den nye database
            options: {
                encrypt: true,
                enableArithAbort: true,
            },
        },
    };

    return knex(newConfig); // Returnér den nye Knex-forbindelse (instans)
}

export default setupDatabase;
