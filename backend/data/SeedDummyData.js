import sequelize from "../config/SqlConfig.ts";
import { User, Book, Author, Publisher, Tag, UserBook, UserBookTag } from "../models/Associations.ts";
import { configDotenv } from "dotenv";

configDotenv();

// Function to create dummy data
async function createDummyData() {
    try {
        // Sync database
        await sequelize.sync({ force: true });

        // Create dummy users
        const users = await User.bulkCreate([
            { name: "Alice", email: "Alice@mail.com" },
            { name: "Bob", email: "Bob@mail.com" },
            { name: "Charlie", email: "Charlie@mail.com" },
        ]);

        // Create dummy publishers
        const publishers = await Publisher.bulkCreate([
            { name: "Penguin Random House" },
            { name: "HarperCollins" },
            { name: "Simon & Schuster" },
        ]);

        // Create dummy books
        const books = await Book.bulkCreate([
            { title: "Book 1", publisher_id: publishers[0].id },
            { title: "Book 2", publisher_id: publishers[1].id },
            { title: "Book 3", publisher_id: publishers[2].id },
        ]);

        // Create dummy authors
        const authors = await Author.bulkCreate([
            { name: "Author 1" },
            { name: "Author 2" },
            { name: "Author 3" },
        ]);

        // Associate books with authors (many-to-many relationship)
        await books[0].addAuthors([authors[0].id, authors[1].id]);
        await books[1].addAuthors([authors[1].id, authors[2].id]);
        await books[2].addAuthors([authors[0].id, authors[2].id]);

        // Create dummy UserBook entries (many-to-many relationship between users and books)
        const userBooks = await UserBook.bulkCreate([
            { user_id: users[0].id, book_id: books[0].id },
            { user_id: users[1].id, book_id: books[1].id },
            { user_id: users[2].id, book_id: books[2].id },
        ]);

        // Create dummy tags
        const tags = await Tag.bulkCreate([
            { name: "Fiction" },
            { name: "Mystery" },
            { name: "Science Fiction" },
        ]);

        // Associate tags with user books (many-to-many relationship using UserBookTag)
        await UserBookTag.bulkCreate([
            { user_book_id: userBooks[0].id, tag_id: tags[0].id },
            { user_book_id: userBooks[1].id, tag_id: tags[1].id },
            { user_book_id: userBooks[2].id, tag_id: tags[2].id },
        ]);

        console.log("Dummy data created successfully!");
    } catch (error) {
        console.error("Error creating dummy data:", error);
    } finally {
        await sequelize.close();
    }
}

// Call the function
createDummyData();
