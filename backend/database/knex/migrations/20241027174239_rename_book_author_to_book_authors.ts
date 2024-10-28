import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.renameTable("book_author", "book_authors");
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.renameTable("book_authors", "book_author");
}