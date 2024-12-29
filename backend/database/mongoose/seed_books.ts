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

            // Process books (no Subject model references, embedding directly)
            const formattedBooks = booksData.books.map((book: any) => ({
                title: book.title || "Unknown Title", // Default if missing
                title_long: book.title_long,
                publisher: book.publisher || "Unknown Publisher", // Default if missing
                authors: book.authors?.map((author: any) => typeof author === 'string' ? author : author?.name) || [],
                isbn: book.isbn,
                isbn10: book.isbn10,
                isbn13: book.isbn13,
                // Subjects are now embedded directly
                subjects: book.subjects?.map((subjectName: any) => ({
                    name: typeof subjectName === 'string' ? subjectName.trim() : subjectName.name.trim()
                })) || [],
                language: book.language || "Unknown Language",
                pages: book.pages || 0, // Default if missing
                publication_date: book.date_published ? new Date(book.date_published) : undefined,
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
