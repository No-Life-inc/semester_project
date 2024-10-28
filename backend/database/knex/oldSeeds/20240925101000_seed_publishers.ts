import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("publishers").del();

  await knex("publishers").insert([
    { name: "Penguin Random House" },
    { name: "HarperCollins" },
  ]);
}
