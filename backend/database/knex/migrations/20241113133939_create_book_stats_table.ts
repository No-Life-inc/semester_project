import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("book_stats", (table) => {
        table.integer("book_id").unsigned().notNullable().references("id").inTable("books").onDelete("CASCADE").primary();
        table.integer("collection_count").unsigned().notNullable();
        table.timestamp("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("book_stats");
}
