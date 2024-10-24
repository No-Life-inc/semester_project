import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {

    await knex('book_genre').del();
    await knex('book_genre').insert([
        { book_id: 1, genre_id: 1 },
        { book_id: 1, genre_id: 2 },
        { book_id: 2, genre_id: 3 },
        { book_id: 2, genre_id: 4 },
        { book_id: 3, genre_id: 5 }
    ]);
};
