import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("books", (table) => {
        table.integer("publisher_id").unsigned().nullable().alter();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("books", (table) => {
        table.integer("publisher_id").unsigned().notNullable().alter();
    });
}