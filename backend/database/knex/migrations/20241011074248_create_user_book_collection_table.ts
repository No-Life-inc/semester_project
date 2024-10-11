import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("collection_books", (table) => {
        table.increments("id").primary(); // Auto-incremented primary key
        table.integer("collection_id").unsigned().notNullable(); // Collection ID, integer, not null
        table.integer("user_book_id").unsigned().notNullable(); // UserBook ID, integer, not null

        // Define foreign keys with CASCADE on delete
        table.foreign("collection_id").references("id").inTable("collections").onDelete("CASCADE");
        table.foreign("user_book_id").references("id").inTable("user_book").onDelete("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("collection_books");
}