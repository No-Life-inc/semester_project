import { User } from '../../models/mongoose/UserModel';
import { HydratedDocument } from 'mongoose';
import { IBook } from '../../models/mongoose/BookModel';
import bcrypt from "bcryptjs";


const seedUsers = async (books: HydratedDocument<IBook>[]) => {
    try {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            if (books && books.length > 0) {
                const userData = [
                    {
                        name: "User 1",
                        email: "test_email@example.com",
                        password: process.env.DEFAULT_PASSWORD,
                        books: books
                            .slice(0, 3)
                            .map(book => book && book._id ? { book_id: book._id, tags: ["classic", "must-read"] } : null)
                            .filter(Boolean),
                        collections: [
                            {
                                name: "Favorites",
                                books: books.slice(0, 3)
                                    .map(book => book && book._id)
                                    .filter(Boolean)
                            }
                        ]
                    },
                    {
                        name: "User 2",
                        email: "test_password@example.com",
                        password: process.env.DEFAULT_PASSWORD,
                        books: books
                            .slice(3, 6)
                            .map(book => book && book._id ? { book_id: book._id, tags: ["fiction"] } : null)
                            .filter(Boolean),
                        collections: [
                            {
                                name: "To Read",
                                books: books.slice(3, 6)
                                    .map(book => book && book._id)
                                    .filter(Boolean)
                            }
                        ]
                    },
                    {
                        name: "Test Testsen",
                        email: "test@test.com",
                        password: process.env.DEFAULT_PASSWORD,
                        books: books
                            .slice(6, 9)
                            .map(book => book && book._id ? { book_id: book._id, tags: ["non-fiction"] } : null)
                            .filter(Boolean),
                        collections: [
                            {
                                name: "Wishlist",
                                books: books.slice(6, 9)
                                    .map(book => book && book._id)
                                    .filter(Boolean)
                            }
                        ]
                    }
                ];

                await User.create(userData);
                console.log("Users seeded successfully");
            }
            else {
                console.error("No books found to link to users. Seed books first.");
            }
        } else {
            console.log("Users already exist in the database. Skipping seeding.");
        }
    } catch (error) {
        console.error("Error seeding users:", error);
    }
};

export default seedUsers;
