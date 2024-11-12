import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries in the relevant tables
    await knex("user_book_tags").del();
    await knex("user_books").del();
    await knex("collection_books").del();
    await knex("user_collections").del();
    await knex("collections").del();
    await knex("users").del();

    // Inserts seed entries for users
    await knex("users").insert([
        { name: "user1", email: "user1@example.com" },
        { name: "user2", email: "user2@example.com" },
        { name: "user3", email: "user3@example.com" }
    ]);

    // Fetch inserted user IDs
    const users = await knex("users").select("id");

    // Inserts seed entries for collections
    await knex("collections").insert([
        { name: "Collection 1" },
        { name: "Collection 2" },
        { name: "Collection 3" }
    ]);

    // Fetch inserted collection IDs
    const collections = await knex("collections").select("id");

    // Create associations between users and collections
    const userCollections = [];
    users.forEach((user, index) => {
        userCollections.push({
            user_id: user.id,
            collection_id: collections[index % collections.length].id,
        });
    });

    // Insert associations into the user_collections table
    await knex("user_collections").insert(userCollections);

    // Fetch existing books from the books table
    const books = await knex("books").select("id").limit(10);

    // Create associations between users and books (user_books table)
    const userBooks = [];
    users.forEach((user) => {
        books.forEach((book) => {
            userBooks.push({
                user_id: user.id,
                book_id: book.id,
            });
        });
    });

    // Insert associations into the user_books table
    await knex("user_books").insert(userBooks);

    // Fetch inserted user_books entries for linking with collections
    const insertedUserBooks = await knex("user_books").select("id", "user_id", "book_id");

    // Create collection associations with only the user’s own books
    const collectionBooks = [];
    insertedUserBooks.forEach((userBook) => {
        // Find a collection belonging to the same user
        const userCollection = userCollections.find(
            (uc) => uc.user_id === userBook.user_id
        );

        if (userCollection) {
            collectionBooks.push({
                collection_id: userCollection.collection_id, // Use the matching user's collection
                user_book_id: userBook.id, // Associate with user_book, ensuring only the user’s books go in their collection
            });
        }
        });


    // Insert associations into the collection_books table
    await knex("collection_books").insert(collectionBooks);

    // Fetch existing tags from the tags table
    const tags = await knex("tags").select("id");

    // Assign tags to user_book associations
    const userBookTags = [];
    insertedUserBooks.forEach((userBook) => {
        tags.forEach((tag) => {
            userBookTags.push({
                user_book_id: userBook.id,
                tag_id: tag.id,
            });
        });
    });

    // Insert associations into the user_book_tags table
    await knex("user_book_tags").insert(userBookTags);
}
