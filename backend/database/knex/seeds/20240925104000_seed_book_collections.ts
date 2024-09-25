import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("book_collections").del();

  await knex("book_collections").insert([
    { name: "Fiction Collection", user_id: 1 },
    { name: "Science Collection", user_id: 2 },
  ]);
}
