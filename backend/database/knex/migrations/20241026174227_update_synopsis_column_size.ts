import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("books", (table) => {
        table.text("synopsis").alter();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("books", (table) => {
        table.string("synopsis", 255).alter(); // Assuming the original size was 255
    });
}