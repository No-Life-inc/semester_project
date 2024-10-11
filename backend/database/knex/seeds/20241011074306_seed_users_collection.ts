import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Slet alle eksisterende indgange
    await knex("user_collections").del();

    // Indsæt testdata uden at specificere `id`-kolonnen
    await knex("user_collections").insert([
        { user_id: 1, collection_id: 1 },
        { user_id: 2, collection_id: 2 },
        { user_id: 3, collection_id: 3 },
        { user_id: 1, collection_id: 2 },
    ]);
}
