import { Book } from '../../models/mongoose/BookModel';

const seedBooks = async () => {
    try {
        const bookCount = await Book.countDocuments();
        if (bookCount === 0) {
            const books = await Book.insertMany([
                {
                    author: [{ name: "George Orwell" }],
                    publisher: "Penguin Books",
                    title: "1984",
                    edition: "1st",
                    cover_id: "1984_cover",
                    isbn: "1234567890",
                    isbn10: "123456789X",
                    isbn13: "9781234567897",
                    subjects: [{ name: "Dystopian" }],
                    language: "English",
                    pages: 328,
                    publication_date: new Date("1949-06-08"),
                    image: "https://example.com/images/1984.jpg",
                    title_long: "Nineteen Eighty-Four",
                    synopsis: "A dystopian novel set in a totalitarian regime.",
                    msrp: 19.99,
                    dimensions: "8 x 5 x 1 inches",
                    binding: "Paperback"
                },
                {
                    author: [{ name: "J.K. Rowling" }],
                    publisher: "Bloomsbury",
                    title: "Harry Potter and the Philosopher's Stone",
                    edition: "1st",
                    cover_id: "hp1_cover",
                    isbn: "0987654321",
                    isbn10: "0747532699",
                    isbn13: "9780747532699",
                    subjects: [{ name: "Fantasy" }],
                    language: "English",
                    pages: 223,
                    publication_date: new Date("1997-06-26"),
                    image: "https://example.com/images/hp1.jpg",
                    title_long: "Harry Potter and the Philosopher's Stone",
                    synopsis: "The first book in the Harry Potter series, introducing Harry's magical world.",
                    msrp: 24.99,
                    dimensions: "8 x 5 x 1 inches",
                    binding: "Hardcover"
                }
            ]);

            console.log('Books seeded:', books);
            return books; // Returner de seeded bøger
        } else {
            console.log("Books already exist, skipping seeding.");
            return [];
        }
    } catch (error) {
        console.error('Error seeding books:', error);
        throw error;
    }
};

export default seedBooks;
