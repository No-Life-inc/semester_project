import e from 'express';
import sequelize from '../config/SqlConfig.js';
import { User, BookCollection, Book, Author, Publisher, BookHasBookCollection, BooksHasAuthors } from '../models/Associations.js';
import { configDotenv } from 'dotenv';

configDotenv();

// Function to create dummy data
async function createDummyData() {
    try {
        // Sync database
        await sequelize.sync({ force: true });

        // Create dummy users
        const users = await User.bulkCreate([
            { name: 'Alice', email: 'Alice@mail.com' },
            { name: 'Bob', email: 'Bob@mail.com'},
            { name: 'Charlie' , email: 'Charlie@mail.com'}
        ]);

        // Create dummy publishers
        const publishers = await Publisher.bulkCreate([
            { name: 'Penguin Random House' },
            { name: 'HarperCollins' },
            { name: 'Simon & Schuster' }
        ]);

        // Create dummy books
        const books = await Book.bulkCreate([
            { title: 'Book 1', publisher_id: publishers[0].id },
            { title: 'Book 2', publisher_id: publishers[1].id },
            { title: 'Book 3', publisher_id: publishers[2].id }
        ]);

        // Create dummy authors
        const authors = await Author.bulkCreate([
            { name: 'Author 1' },
            { name: 'Author 2' },
            { name: 'Author 3' }
        ]);

        // Create dummy book collections
        const bookCollections = await BookCollection.bulkCreate([
            { name: 'Collection 1', user_id: users[0].id },
            { name: 'Collection 2', user_id: users[1].id },
            { name: 'Collection 3', user_id: users[2].id }
        ]);

        // Create dummy book-author associations
        await BooksHasAuthors.bulkCreate([
            { book_id: books[0].id, author_id: authors[0].id },
            { book_id: books[0].id, author_id: authors[1].id },
            { book_id: books[1].id, author_id: authors[1].id },
            { book_id: books[1].id, author_id: authors[2].id },
            { book_id: books[2].id, author_id: authors[0].id },
            { book_id: books[2].id, author_id: authors[2].id }
        ]);

        // Create dummy book-collection associations
        await BookHasBookCollection.bulkCreate([
            { books_id: books[0].id, book_collections_id: bookCollections[0].id },
            { books_id: books[1].id, book_collections_id: bookCollections[0].id },
            { books_id: books[1].id, book_collections_id: bookCollections[1].id },
            { books_id: books[2].id, book_collections_id: bookCollections[1].id },
            { books_id: books[0].id, book_collections_id: bookCollections[2].id },
            { books_id: books[2].id, book_collections_id: bookCollections[2].id }
        ]);

        console.log('Dummy data created successfully!');
    } catch (error) {
        console.error('Error creating dummy data:', error);
    } finally {
        await sequelize.close();
    }
}

// Call the function
createDummyData();