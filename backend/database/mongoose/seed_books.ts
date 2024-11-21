import { Book } from '../../models/mongoose/BookModel';
import fs from 'fs';
import path from 'path';

const seedBooks = async () => {
    try {
        const bookCount = await Book.countDocuments();
        if (bookCount === 0) {
            const filePath = path.resolve("./database/dump/books.json");
            const booksData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            // Validate the books array
            if (!booksData || !Array.isArray(booksData.books)) {
                throw new Error("Invalid books data format. Ensure the JSON file contains a 'books' array.");
            }

            // Transform and seed data
            const formattedBooks = booksData.books.map((book: any) => ({
                title: book.title || "Unknown Title", // Default if missing
                title_long: book.title_long,
                publisher: book.publisher || "Unknown Publisher", // Default if missing
                authors: book.authors?.map((author: any) => typeof author === 'string' ? author : author?.name) || [], // Handle missing or structured authors
                isbn: book.isbn,
                isbn10: book.isbn10,
                isbn13: book.isbn13,
                subjects: book.subjects?.map((subject: any) => typeof subject === 'string' ? subject : subject?.name) || [], // Handle missing or structured subjects
                language: book.language || "Unknown Language",
                pages: book.pages || 0, // Default if missing
                publication_date: book.date_published ? new Date(book.date_published) : undefined, // Convert date_published to Date
                image: book.image,
                synopsis: book.synopsis || "No synopsis available.", // Default if missing
                msrp: book.msrp || 0, // Default if missing
                dimensions: book.dimensions,
                binding: book.binding,
                edition: book.edition,
            }));

            const books = await Book.insertMany(formattedBooks);
            console.log('Books seeded successfully:', books.length);
        } else {
            console.log('Books already exist, skipping seeding.');
        }
    } catch (error) {
        console.error('Error seeding books:', error);
        throw error;
    }
};

export default seedBooks;
