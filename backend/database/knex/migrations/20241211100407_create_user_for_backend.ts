import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {




    if (process.env.NODE_ENV === "test") {
        return;
    }

    await knex.raw(`
        CREATE LOGIN LimitedUser WITH PASSWORD = 'StrongPassword123!';
    `);

    await knex.raw(`
        CREATE USER LimitedUser FOR LOGIN LimitedUser;
        GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::dbo TO LimitedUser;
    `);

    await knex.raw(`
        DENY DELETE ON dbo.books TO LimitedUser;
        DENY ALTER ON SCHEMA::dbo TO LimitedUser;
    `);

}

export async function down(knex: Knex): Promise<void> {
    if (process.env.NODE_ENV === "test") {
        return;
    }
    
    await knex.raw(`DROP USER LimitedUser;`);
    await knex.raw(`DROP LOGIN LimitedUser;`);
}
