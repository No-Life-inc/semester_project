import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Slet eksisterende data i "books" tabellen
  await knex("books").del();

  const [penguinRandomHouse] = await knex("publishers").where({ name: "Penguin Random House" }).select("id");
  const [harperCollins] = await knex("publishers").where({ name: "HarperCollins" }).select("id");

  // Indsæt data i "books" tabellen med alle nødvendige referencer
  await knex("books").insert([
    { title: "1984",  publisher_id: penguinRandomHouse.id },
    { title: "Brave New World",  publisher_id: harperCollins.id },
    { title: "Fahrenheit 451",  publisher_id: penguinRandomHouse.id },
  ]);
}