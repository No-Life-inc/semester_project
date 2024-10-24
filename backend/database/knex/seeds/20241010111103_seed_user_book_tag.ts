import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex("user_book_tags").del();

    const [userBook1] = await knex("user_book").where({ user_id: 1, book_id: 1 }).select("id");
    const [userBook2] = await knex("user_book").where({ user_id: 1, book_id: 2 }).select("id");
    const [userBook3] = await knex("user_book").where({ user_id: 2, book_id: 3 }).select("id");

    const [tag1] = await knex("tags").where({ name: "Favourites" }).select("id");
    const [tag2] = await knex("tags").where({ name: "Moms smut" }).select("id");
    const [tag3] = await knex("tags").where({ name: "Classic" }).select("id");

    await knex("user_book_tags").insert([
        { user_book_id: userBook1.id, tag_id: tag1.id },
        { user_book_id: userBook1.id, tag_id: tag3.id },
        { user_book_id: userBook2.id, tag_id: tag2.id },
        { user_book_id: userBook3.id, tag_id: tag1.id },
    ]);
}
