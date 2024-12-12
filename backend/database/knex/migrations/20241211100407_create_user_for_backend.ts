import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // 1. Opret bruger
    await knex.raw(`
        CREATE LOGIN LimitedUser WITH PASSWORD = 'StrongPassword123!';
        CREATE USER LimitedUser FOR LOGIN LimitedUser;
    `);

    // 2. Tildel generelle rettigheder (inkl. DELETE)
    await knex.raw(`
        GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::dbo TO LimitedUser;
    `);

    // 3. Nægt DELETE på books-tabellen
    await knex.raw(`
        DENY DELETE ON dbo.books TO LimitedUser;
        DENY ALTER ON SCHEMA::dbo TO LimitedUser;
    `);
}

export async function down(knex: Knex): Promise<void> {
    // Fjern bruger
    await knex.raw(`DROP USER LimitedUser;`);
    await knex.raw(`DROP LOGIN LimitedUser;`);
}
