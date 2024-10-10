import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('books', (table) => {
        table.increments('id').primary();
        table.integer('author_id').unsigned().references('id').inTable('authors').notNullable().onDelete('CASCADE');
        table.integer('publisher_id').unsigned().references('id').inTable('publishers').notNullable().onDelete('CASCADE');
        table.string('title').notNullable();
        table.string('edition');
        table.integer('cover_id').unsigned();
        table.string('isbn');
        table.string('genre');
        table.string('language');
        table.integer('page_num');
        table.date('publication_date');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('books');
}
