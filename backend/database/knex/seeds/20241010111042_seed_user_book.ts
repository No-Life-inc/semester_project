import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex("user_book").del();

    const [user1] = await knex("users").where({ name: "John Doe" }).select("id");
    const [user2] = await knex("users").where({ name: "Jane Smith" }).select("id");

    const [book1] = await knex("books").where({ title: "1984" }).select("id");
    const [book2] = await knex("books").where({ title: "Brave New World" }).select("id");
    const [book3] = await knex("books").where({ title: "Fahrenheit 451" }).select("id");

    await knex("user_book").insert([
        { user_id: user1.id, book_id: book1.id },
        { user_id: user1.id, book_id: book2.id },
        { user_id: user2.id, book_id: book3.id },
    ]);
}
