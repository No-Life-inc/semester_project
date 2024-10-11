import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("user_book_tags", (table) => {
        table.increments("id").primary(); // Auto-incremented primary key
        table.integer("user_book_id").unsigned().notNullable(); // UserBook ID, integer, not null
        table.integer("tag_id").unsigned().notNullable(); // Tag ID, integer, not null

        // Optional: Define foreign keys if `user_book` and `tags` tables exist
        table.foreign("user_book_id").references("id").inTable("user_book").onDelete("CASCADE");
        table.foreign("tag_id").references("id").inTable("tags").onDelete("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("user_book_tags");
}
