import { User, IEmbeddedBook } from '../../models/mongoose/UserModel';
import { HydratedDocument } from 'mongoose';
import { IBook } from '../../models/mongoose/BookModel';


const seedUsers = async (books: HydratedDocument<IBook>[]) => {
    try {
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            console.log('Users already exist in the database. Skipping seeding.');
            return;
        }

        if (!books || books.length === 0) {
            console.error('No books found to link to users. Seed books first.');
            return;
        }

        const userData = [
            {
                name: 'User 1',
                email: 'test_email@example.com',
                password: process.env.DEFAULT_PASSWORD,
                books: books.slice(0, 3).map((book) => ({
                    book_id: book._id,
                    embeddedBook: {
                        authors: book.authors.map((author) => ({
                            name: author?.name || 'Unknown Author',
                        })),
                        publisher: book.publisher,
                        title: book.title,
                        edition: book.edition,
                        cover_id: book.cover_id,
                        isbn: book.isbn,
                        isbn10: book.isbn10,
                        isbn13: book.isbn13,
                        subjects: book.subjects.map((sub) => ({
                            name: sub.name,
                        })),
                        language: book.language,
                        pages: book.pages,
                        publication_date: book.publication_date,
                        image: book.image,
                        title_long: book.title_long,
                        synopsis: book.synopsis,
                        msrp: book.msrp,
                        dimensions: book.dimensions,
                        binding: book.binding,
                    } as IEmbeddedBook,
                    tags: ['classic', 'must-read'],
                })),
                collections: [
                    {
                        name: 'Favorites',
                        books: books.slice(0, 3).map((book) => ({
                            book_id: book._id,
                            embeddedBook: {
                                authors: book.authors.map((author) => ({
                                    name: author?.name || 'Unknown Author',
                                })),
                                publisher: book.publisher,
                                title: book.title,
                                edition: book.edition,
                                cover_id: book.cover_id,
                                isbn: book.isbn,
                                isbn10: book.isbn10,
                                isbn13: book.isbn13,
                                subjects: book.subjects.map((sub) => ({
                                    name: sub.name,
                                })),
                                language: book.language,
                                pages: book.pages,
                                publication_date: book.publication_date,
                                image: book.image,
                                title_long: book.title_long,
                                synopsis: book.synopsis,
                                msrp: book.msrp,
                                dimensions: book.dimensions,
                                binding: book.binding,
                            } as IEmbeddedBook,
                        })),
                    },
                ],
            },
            {
                name: 'User 2',
                email: 'test_password@example.com',
                password: process.env.DEFAULT_PASSWORD,
                books: books.slice(3, 6).map((book) => ({
                    book_id: book._id,
                    embeddedBook: {
                        authors: book.authors.map((author) => ({
                            name: author?.name || 'Unknown Author',
                        })),
                        publisher: book.publisher,
                        title: book.title,
                        edition: book.edition,
                        cover_id: book.cover_id,
                        isbn: book.isbn,
                        isbn10: book.isbn10,
                        isbn13: book.isbn13,
                        subjects: book.subjects.map((sub) => ({
                            name: sub.name,
                        })),
                        language: book.language,
                        pages: book.pages,
                        publication_date: book.publication_date,
                        image: book.image,
                        title_long: book.title_long,
                        synopsis: book.synopsis,
                        msrp: book.msrp,
                        dimensions: book.dimensions,
                        binding: book.binding,
                    } as IEmbeddedBook,
                    tags: ['fiction'],
                })),
                collections: [
                    {
                        name: 'To Read',
                        books: books.slice(3, 6).map((book) => ({
                            book_id: book._id,
                            embeddedBook: {
                                authors: book.authors.map((author) => ({
                                    name: author?.name || 'Unknown Author',
                                })),
                                publisher: book.publisher,
                                title: book.title,
                                edition: book.edition,
                                cover_id: book.cover_id,
                                isbn: book.isbn,
                                isbn10: book.isbn10,
                                isbn13: book.isbn13,
                                subjects: book.subjects.map((sub) => ({
                                    name: sub.name,
                                })),
                                language: book.language,
                                pages: book.pages,
                                publication_date: book.publication_date,
                                image: book.image,
                                title_long: book.title_long,
                                synopsis: book.synopsis,
                                msrp: book.msrp,
                                dimensions: book.dimensions,
                                binding: book.binding,
                            } as IEmbeddedBook,
                        })),
                    },
                ],
            },
            {
                name: 'Test Testsen',
                email: 'test@test.com',
                password: process.env.DEFAULT_PASSWORD,
                books: books.slice(6, 9).map((book) => ({
                    book_id: book._id,
                    embeddedBook: {
                        authors: book.authors.map((author) => ({
                            name: author?.name || 'Unknown Author',
                        })),
                        publisher: book.publisher,
                        title: book.title,
                        edition: book.edition,
                        cover_id: book.cover_id,
                        isbn: book.isbn,
                        isbn10: book.isbn10,
                        isbn13: book.isbn13,
                        subjects: book.subjects.map((sub) => ({
                            name: sub.name,
                        })),
                        language: book.language,
                        pages: book.pages,
                        publication_date: book.publication_date,
                        image: book.image,
                        title_long: book.title_long,
                        synopsis: book.synopsis,
                        msrp: book.msrp,
                        dimensions: book.dimensions,
                        binding: book.binding,
                    } as IEmbeddedBook,
                    tags: ['non-fiction'],
                })),
                collections: [
                    {
                        name: 'Wishlist',
                        books: books.slice(6, 9).map((book) => ({
                            book_id: book._id,
                            embeddedBook: {
                                authors: book.authors.map((author) => ({
                                    name: author?.name || 'Unknown Author',
                                })),
                                publisher: book.publisher,
                                title: book.title,
                                edition: book.edition,
                                cover_id: book.cover_id,
                                isbn: book.isbn,
                                isbn10: book.isbn10,
                                isbn13: book.isbn13,
                                subjects: book.subjects.map((sub) => ({
                                    name: sub.name,
                                })),
                                language: book.language,
                                pages: book.pages,
                                publication_date: book.publication_date,
                                image: book.image,
                                title_long: book.title_long,
                                synopsis: book.synopsis,
                                msrp: book.msrp,
                                dimensions: book.dimensions,
                                binding: book.binding,
                            } as IEmbeddedBook,
                        })),
                    },
                ],
            },
        ];
        const createdUsers = await User.create(userData);
        console.log('Users seeded successfully:', createdUsers.length);
    } catch (error) {
        console.error('Error seeding users:', error);
    }
};

export default seedUsers;
