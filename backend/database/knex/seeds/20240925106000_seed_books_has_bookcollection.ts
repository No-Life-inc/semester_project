import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("books_has_bookcollection").del();

  await knex("books_has_bookcollection").insert([
    { books_id: 1, book_collections_id: 1, status: "read" },
    { books_id: 2, book_collections_id: 1, status: "want to read" },
    { books_id: 3, book_collections_id: 2, status: "currently reading" },
  ]);
}
