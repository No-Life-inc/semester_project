import { User } from '../../models/mongoose/UserModel';
import { HydratedDocument } from 'mongoose';
import { IBook } from '../../models/mongoose/BookModel';

const seedUsers = async (books: HydratedDocument<IBook>[]) => {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
        if (books.length > 0) {
            await User.insertMany([
                {
                    name: "Alice",
                    email: "alice@example.com",
                    books: books.map(book => ({ book_id: book._id, tags: ["classic", "must-read"] })),
                    collections: [
                        { name: "Favorites", books: books.map(book => book._id) }
                    ]
                },
            ]);
            console.log("Users seeded successfully");
        } else {
            console.error("No books found to link to users. Seed books first.");
        }
    }
};

export default seedUsers;
