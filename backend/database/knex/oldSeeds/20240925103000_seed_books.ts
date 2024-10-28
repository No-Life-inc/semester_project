import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("books").del();

  const [penguinRandomHouse] = await knex("publishers").where({ name: "Penguin Random House" }).select("id");
  const [harperCollins] = await knex("publishers").where({ name: "HarperCollins" }).select("id");

  await knex("books").insert([
    { title: "1984",  publisher_id: penguinRandomHouse.id },
    { title: "Brave New World",  publisher_id: harperCollins.id },
    { title: "Fahrenheit 451",  publisher_id: penguinRandomHouse.id },
  ]);
}