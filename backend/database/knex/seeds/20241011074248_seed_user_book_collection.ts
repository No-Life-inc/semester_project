import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Slet alle eksisterende indgange
    await knex("collection_books").del();

    // Indsæt testdata uden id'er
    await knex("collection_books").insert([
        { collection_id: 1, user_book_id: 1 },
        { collection_id: 2, user_book_id: 2 },
        { collection_id: 3, user_book_id: 3 },
    ]);
}