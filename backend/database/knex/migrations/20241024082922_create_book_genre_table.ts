import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('book_genre', (table) => {
        table.increments('id').primary();
        table.integer('book_id').unsigned().references('id').inTable('books').notNullable().onDelete('CASCADE');
        table.integer('genre_id').unsigned().references('id').inTable('genre').notNullable().onDelete('CASCADE');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('book_genre');
}

