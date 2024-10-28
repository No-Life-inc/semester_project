import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("books", (table) => {
       table.string("isbn10");
       table.string("isbn13");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("books", (table) => {
        table.dropColumn("isbn10");
        table.dropColumn("isbn13");
    });
}