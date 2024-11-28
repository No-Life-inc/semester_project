import { Book } from '../../models/mongoose/BookModel';
import { Subject } from '../../models/mongoose/SubjectModel';
import fs from 'fs';
import path from 'path';

const seedBooks = async () => {
    try {
        const bookCount = await Book.countDocuments();
        const subjectCount = await Subject.countDocuments();

        if (bookCount === 0 || subjectCount === 0) {
            const filePath = path.resolve("./database/dump/books.json");
            const booksData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            // Validate the books array
            if (!booksData || !Array.isArray(booksData.books)) {
                throw new Error("Invalid books data format. Ensure the JSON file contains a 'books' array.");
            }

            const subjectMap = new Map<string, string>(); // To store unique subjects and their ObjectIds

            // Process subjects first
            for (const book of booksData.books) {
                if (book.subjects && Array.isArray(book.subjects)) {
                    for (const subjectName of book.subjects) {
                        const cleanSubjectName = typeof subjectName === 'string' ? subjectName.trim() : subjectName.name.trim();
                        if (!subjectMap.has(cleanSubjectName)) {
                            // Check if subject already exists in the database
                            const existingSubject = await Subject.findOne({ name: cleanSubjectName });
                            if (existingSubject) {
                                subjectMap.set(cleanSubjectName, existingSubject._id.toString());
                            } else {
                                const newSubject = await Subject.create({ name: cleanSubjectName });
                                subjectMap.set(cleanSubjectName, newSubject._id.toString());
                            }
                        }
                    }
                }
            }

            // Process books
            const formattedBooks = booksData.books.map((book: any) => ({
                title: book.title || "Unknown Title", // Default if missing
                title_long: book.title_long,
                publisher: book.publisher || "Unknown Publisher", // Default if missing
                authors: book.authors?.map((author: any) => typeof author === 'string' ? author : author?.name) || [], // Handle missing or structured authors
                isbn: book.isbn,
                isbn10: book.isbn10,
                isbn13: book.isbn13,
                subjects: book.subjects?.map((subjectName: any) =>
                    subjectMap.get(typeof subjectName === 'string' ? subjectName.trim() : subjectName.name.trim())
                ) || [], // Map subject names to their ObjectIds
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
            console.log('Books and subjects already exist, skipping seeding.');
        }
    } catch (error) {
        console.error('Error seeding books:', error);
        throw error;
    }
};

export default seedBooks;
