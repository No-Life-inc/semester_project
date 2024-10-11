import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Slet eksisterende data i "books" tabellen
  await knex("books").del();

  // Find IDs for forfattere og udgivere for at referere dem korrekt
  const [georgeOrwell] = await knex("authors").where({ name: "George Orwell" }).select("id");
  const [aldousHuxley] = await knex("authors").where({ name: "Aldous Huxley" }).select("id");
  const [rayBradbury] = await knex("authors").where({ name: "Ray Bradbury" }).select("id");

  const [penguinRandomHouse] = await knex("publishers").where({ name: "Penguin Random House" }).select("id");
  const [harperCollins] = await knex("publishers").where({ name: "HarperCollins" }).select("id");

  // Indsæt data i "books" tabellen med alle nødvendige referencer
  await knex("books").insert([
    { title: "1984", author_id: georgeOrwell.id, publisher_id: penguinRandomHouse.id },
    { title: "Brave New World", author_id: aldousHuxley.id, publisher_id: harperCollins.id },
    { title: "Fahrenheit 451", author_id: rayBradbury.id, publisher_id: penguinRandomHouse.id },
  ]);
}