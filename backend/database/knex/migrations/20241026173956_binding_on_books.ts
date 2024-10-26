import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("books", (table) => {
       table.string("binding");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("books", (table) => {
        table.dropColumn("binding");
    });
}