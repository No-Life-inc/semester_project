import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {

    // Deletes ALL existing entries
    await knex("book_author").del();

    // Inserts seed entries
    await knex("book_author").insert([
        { book_id: 1, author_id: 1 },
        { book_id: 1, author_id: 2 },
        { book_id: 2, author_id: 3 },
        { book_id: 3, author_id: 2}
    ]);
};
