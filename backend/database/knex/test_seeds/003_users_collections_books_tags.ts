import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex("user_book_tags").del();
    await knex("collection_books").del();
    await knex("user_books").del();
    await knex("collections").del();
    await knex("users").del();

    // Seed users
    const [user1, user2, user3] = await knex("users")
        .insert([
            { name: "user1", email: "user1@example.com", password: "password" },
            { name: "user2", email: "user2@example.com", password: "password" },
            { name: "user3", email: "user3@example.com", password: "password" },
        ])
        .returning("*");

    // Seed collections
    const [collection1, collection2, collection3] = await knex("collections")
        .insert([
            { name: "Collection 1", user_id: user1.id },
            { name: "Collection 2", user_id: user2.id },
            { name: "Collection 3", user_id: user3.id },
        ])
        .returning("*");

    // Fetch existing books in a deterministic order
    const books = await knex("books").select("id").orderBy("id", "asc").limit(10);
    console.log("Seeded Books:", books);

    // Seed UserBooks
    const userBooks = [
        { user_id: user1.id, book_id: books[0].id },
        { user_id: user2.id, book_id: books[1].id },
        { user_id: user3.id, book_id: books[2].id },
    ];
    const insertedUserBooks = await knex("user_books").insert(userBooks).returning("*");
    console.log("Seeded UserBooks:", insertedUserBooks);

    // Seed UserBookCollection
    const userBookCollections = [
        { collection_id: collection1.id, user_book_id: insertedUserBooks[0].id },
        { collection_id: collection2.id, user_book_id: insertedUserBooks[1].id },
        { collection_id: collection3.id, user_book_id: insertedUserBooks[2].id },
    ];
    await knex("collection_books").insert(userBookCollections);

    const tags = await knex("tags").select("id");
    const userBookTags = insertedUserBooks.map((userBook, index) => ({
        user_book_id: userBook.id,
        tag_id: tags[index % tags.length].id,
    }));
    await knex("user_book_tags").insert(userBookTags);
}
