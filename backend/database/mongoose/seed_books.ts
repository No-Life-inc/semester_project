import { Book } from '../../models/mongoose/BookModel';

const seedBooks = async () => {
    try {
        const books = await Book.insertMany([
            {
                author: { name: "George Orwell" },
                publisher: { name: "Penguin Books" },
                title: "1984",
                isbn: "1234567890",
                genre: "Dystopian",
                language: "English",
                page_num: 328,
                publication_date: new Date("1949-06-08")
            },
            {
                author: { name: "J.K. Rowling" },
                publisher: { name: "Bloomsbury" },
                title: "Harry Potter and the Philosopher's Stone",
                isbn: "0987654321",
                genre: "Fantasy",
                language: "English",
                page_num: 223,
                publication_date: new Date("1997-06-26")
            }
        ]);

        console.log('Books seeded:', books);
        return books; // Returner de seeded bøger
    } catch (error) {
        console.error('Error seeding books:', error);
        throw error;
    }
};

export default seedBooks;
