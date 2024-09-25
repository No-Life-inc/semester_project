import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("books").del();

  await knex("books").insert([
    { title: "1984", publisher_id: 1 },
    { title: "Brave New World", publisher_id: 2 },
    { title: "Fahrenheit 451", publisher_id: 1 },
  ]);
}
