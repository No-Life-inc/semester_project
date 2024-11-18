import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('users', table => {
        table.string('password', 60).alter();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('users', table => {
        table.string('password', 255).alter();
    });
}
