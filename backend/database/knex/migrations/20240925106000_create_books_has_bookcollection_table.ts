import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("books_has_bookcollection", (table) => {
    table.integer("books_id").unsigned().notNullable();
    table.integer("book_collections_id").unsigned().notNullable();
    table.string("status").notNullable().defaultTo("want to read");

    table.primary(["books_id", "book_collections_id"]);

    table
      .foreign("books_id")
      .references("id")
      .inTable("books")
      .onDelete("CASCADE");
    table
      .foreign("book_collections_id")
      .references("id")
      .inTable("book_collections")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("books_has_bookcollection");
}
