import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.renameTable("user_book", "user_books");
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.renameTable("user_books", "user_book");
}