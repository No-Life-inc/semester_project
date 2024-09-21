import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('books', (table) => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.string('author').notNullable();
        table.integer('year');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('books');
}
