import type { Knex } from "knex";



export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('books', table => {
        table.string('isbn', 13).alter();
        table.string('isbn10', 10).alter();
        table.string('isbn13', 13).alter();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('books', table => {
        table.string('isbn', 255).alter();
        table.string('isbn10', 255).alter();
        table.string('isbn13', 255).alter();
    });
}

