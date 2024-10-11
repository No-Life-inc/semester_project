import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Slet alle eksisterende indgange
    await knex("collections").del();

    // Indsæt testdata uden at specificere `id`-kolonnen
    await knex("collections").insert([
        { name: "Science Fiction Collection" },
        { name: "Fantasy Collection" },
        { name: "Classic Literature" },
    ]);
}