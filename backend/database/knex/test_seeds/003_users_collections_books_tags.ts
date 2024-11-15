import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries in the relevant tables
    await knex("user_book_tags").del();
    await knex("collection_books").del();
    await knex("user_books").del();
    await knex("collections").del();
    await knex("users").del();

    // Inserts seed entries for users
    const [user1, user2, user3] = await knex("users").insert([
        { name: "user1", email: "user1@example.com", password: "password" },
        { name: "user2", email: "user2@example.com", password: "password" },
        { name: "user3", email: "user3@example.com", password: "password" }
    ]).returning("id");

    // Inserts seed entries for collections
    const [collection1, collection2, collection3] = await knex("collections").insert([
        { name: "Collection 1", user_id: user1.id },
        { name: "Collection 2", user_id: user2.id },
        { name: "Collection 3", user_id: user3.id }
    ]).returning("id");

    // Fetch existing books from the books table
    const books = await knex("books").select("id").limit(10);

    // Create associations between users and books
    const userBooks = [];
    for (const user of [user1, user2, user3]) {
        for (const book of books) {
            userBooks.push({
                user_id: user.id,
                book_id: book.id
            });
        }
    }
    const insertedUserBooks = await knex("user_books").insert(userBooks).returning(["id", "user_id", "book_id"]);

    // Create collection associations with user books
    const collectionBooks = [];
    for (const userBook of insertedUserBooks) {
        for (const collection of [collection1, collection2, collection3]) {
            collectionBooks.push({
                collection_id: collection.id,
                user_book_id: userBook.id
            });
        }
    }
    await knex("collection_books").insert(collectionBooks);

    // Fetch existing tags from the tags table
    const tags = await knex("tags").select("id");

    // Assign tags to user_book associations
    const userBookTags = [];
    insertedUserBooks.forEach((userBook) => {
        tags.forEach((tag) => {
            userBookTags.push({
                user_book_id: userBook.id,
                tag_id: tag.id
            });
        });
    });

    // Use batchInsert to handle large inserts
    const batchSize = 1000; // Adjust the batch size as needed
    await knex.batchInsert("user_book_tags", userBookTags, batchSize);
}
