import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("user_book", (table) => {
        table.increments("id").primary(); // Auto-incremented primary key
        table.integer("user_id").unsigned().notNullable(); // User ID, integer, not null
        table.integer("book_id").unsigned().notNullable(); // Book ID, integer, not null

        // Optional: Define foreign keys if `users` and `books` tables exist
        table.foreign("user_id").references("id").inTable("users").onDelete("CASCADE");
        table.foreign("book_id").references("id").inTable("books").onDelete("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("user_book");
}
