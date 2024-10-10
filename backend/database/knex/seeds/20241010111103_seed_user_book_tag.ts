import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex("user_book_tags").del();

    const [userBook1] = await knex("user_book").where({ user_id: 1, book_id: 1 }).select("id");
    const [userBook2] = await knex("user_book").where({ user_id: 1, book_id: 2 }).select("id");
    const [userBook3] = await knex("user_book").where({ user_id: 2, book_id: 3 }).select("id");

    const [tagFiction] = await knex("tags").where({ name: "Fiction" }).select("id");
    const [tagSciFi] = await knex("tags").where({ name: "Science Fiction" }).select("id");
    const [tagClassic] = await knex("tags").where({ name: "Classic" }).select("id");

    await knex("user_book_tags").insert([
        { user_book_id: userBook1.id, tag_id: tagFiction.id },
        { user_book_id: userBook1.id, tag_id: tagClassic.id },
        { user_book_id: userBook2.id, tag_id: tagSciFi.id },
        { user_book_id: userBook3.id, tag_id: tagFiction.id },
    ]);
}
