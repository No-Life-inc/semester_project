import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("user_collections", (table) => {
        table.increments("id").primary(); // Auto-incremented primary key
        table.integer("user_id").unsigned().notNullable(); // User ID, integer, not null
        table.integer("collection_id").unsigned().notNullable(); // Collection ID, integer, not null

        table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
        table.foreign("collection_id").references("id").inTable("collections").onDelete("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("user_collections");
}