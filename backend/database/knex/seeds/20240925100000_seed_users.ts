import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("users").del();

  await knex("users").insert([
    { name: "John Doe" },
    { name: "Jane Smith" },
    { name: "Alice Johnson" },
  ]);
}
