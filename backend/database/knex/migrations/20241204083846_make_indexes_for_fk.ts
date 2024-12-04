import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

    await knex.schema.alterTable('books', table => {
        table.index('publisher_id');
    });

    await knex.schema.alterTable('book_authors', table => {
        table.index('book_id');
    });

    await knex.schema.alterTable('book_subjects', table => {
        table.index('book_id');
    });

    await knex.schema.alterTable('collections', table => {
        table.index('user_id');
    });

    await knex.schema.alterTable('user_books', table => {
        table.index('user_id');
    }); 

    await knex.schema.alterTable('collection_books', table => {
        table.index('collection_id');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('books', table => {
        table.dropIndex('publisher_id');
    });

    await knex.schema.alterTable('book_authors', table => {
        table.dropIndex('book_id');
    });

    await knex.schema.alterTable('book_subjects', table =>
    {
        table.dropIndex('book_id');
    });

    await knex.schema.alterTable('collections', table => {
        table.dropIndex('user_id');
    });

    await knex.schema.alterTable('user_books', table => {
        table.dropIndex('user_id');
    });

    await knex.schema.alterTable('collection_books', table => {
        table.dropIndex('collection_id');
    });
}

