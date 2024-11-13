import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.table('books', table => {
        table.dropColumn('cover_id');
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.table('books', table => {
        table.integer('cover_id').unsigned();
    });
}

