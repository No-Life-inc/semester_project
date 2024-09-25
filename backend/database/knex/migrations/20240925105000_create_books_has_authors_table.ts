import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("books_has_authors", (table) => {
        table.integer("book_id").unsigned().notNullable();
        table.integer("author_id").unsigned().notNullable();

        table.primary(["book_id", "author_id"]);

        table.foreign("book_id").references("id").inTable("books").onDelete("CASCADE");
        table.foreign("author_id").references("id").inTable("authors").onDelete("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("books_has_authors");
}
