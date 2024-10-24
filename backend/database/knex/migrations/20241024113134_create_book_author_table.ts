import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("book_author", (table) => {
        table.increments("id").primary();
        table.integer("book_id").unsigned().notNullable();
        table.integer("author_id").unsigned().notNullable();
        table.foreign("book_id").references("books.id");
        table.foreign("author_id").references("authors.id");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("book_author");
}

