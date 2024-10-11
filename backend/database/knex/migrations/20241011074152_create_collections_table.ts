import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("collections", (table) => {
        table.increments("id").primary(); // Auto-incremented primary key
        table.string("name").notNullable(); // Name field, string, not null
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("collections");
}