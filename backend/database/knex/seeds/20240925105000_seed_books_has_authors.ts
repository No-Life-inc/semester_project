import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("books_has_authors").del();

  await knex("books_has_authors").insert([
    { book_id: 1, author_id: 1 },
    { book_id: 2, author_id: 2 },
    { book_id: 3, author_id: 3 },
  ]);
}
