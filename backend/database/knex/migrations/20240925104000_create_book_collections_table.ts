import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("book_collections", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();

        // Foreign key to users
        table.integer("user_id").unsigned().notNullable();
        table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("book_collections");
}
