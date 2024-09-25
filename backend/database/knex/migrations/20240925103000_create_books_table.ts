import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("books", (table) => {
        table.increments("id").primary();
        table.string("title").notNullable();

        // Foreign key to publishers
        table.integer("publisher_id").unsigned().notNullable();
        table.foreign("publisher_id").references("id").inTable("publishers").onDelete("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("books");
}
