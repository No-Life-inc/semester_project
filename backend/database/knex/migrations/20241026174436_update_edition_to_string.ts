import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("books", (table) => {
        table.string("edition").alter();
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("books", (table) => {
        table.integer("edition").alter();
    });
}

