import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("authors").del();

  await knex("authors").insert([
    { name: "George Orwell" },
    { name: "Aldous Huxley" },
    { name: "Ray Bradbury" },
  ]);
}
