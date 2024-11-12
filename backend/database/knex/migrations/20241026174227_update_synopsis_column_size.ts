import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("books", (table) => {
        table.text("synopsis").alter();
    });
}

export async function down(knex: Knex): Promise<void> {
    // Truncate `synopsis` values to 255 characters to prevent truncation errors
    await knex("books").whereRaw("LEN(synopsis) > 255").update({
        synopsis: knex.raw("LEFT(synopsis, 255)"),
    });

    // Now alter the column to reduce the size to 255 characters
    await knex.schema.alterTable("books", (table) => {
        table.string("synopsis", 255).alter();
    });
}
