import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("most_popular_author", (table) => {
        table.increments("id").primary();
        table.integer("author_id").notNullable().references("id")
            .inTable("authors").onDelete("CASCADE");
        table.integer('popularity').notNullable();
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("most_popular_author");
}

