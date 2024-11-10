import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Alter the publisher_id column to make it nullable
    await knex.schema.alterTable("books", (table) => {
        table.integer("publisher_id").unsigned().nullable().alter();
    });
}

export async function down(knex: Knex): Promise<void> {
    // Set NULL publisher_id values to a valid existing publisher_id, like 1
    await knex("books").whereNull("publisher_id").update("publisher_id", 1);

    // Apply the NOT NULL constraint
    await knex.schema.alterTable("books", (table) => {
        table.integer("publisher_id").unsigned().notNullable().alter();
    });
}

