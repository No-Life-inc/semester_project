import type { Knex } from "knex";

const tables = [
    "authors",
    "book_authors",
    "book_subjects",
    "books",
    "collection_books",
    "collections",
    "publishers",
    "subjects",
    "tags",
    "user_book_tags",
    "user_books",
    "user_collections",
    "users"
];

export async function up(knex: Knex): Promise<void> {
    for (const tableName of tables) {
        await knex.schema.alterTable(tableName, (table) => {
            table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    for (const tableName of tables) {
        await knex.schema.alterTable(tableName, (table) => {
            table.dropColumn('created_at');
        });
    }
}