import mongoose from 'mongoose';
import  '../models/mongoose/BookModel';
import '../models/mongoose/UserModel';
import seedBooks from '../database/mongoose/seed_books';
import seedUsers from '../database/mongoose/seed_users';
import {IBook, Book} from "../models/mongoose/BookModel";
import { User } from "../models/mongoose/UserModel";

const connectMongoDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        await mongoose.connect(uri);
        console.log('MongoDB connected');

        const bookCount = await Book.countDocuments();
        const userCount = await User.countDocuments();

        if (bookCount === 0 && userCount === 0) {
            await seedData();
        } else {
            console.log('Data already exists, skipping seeding.');
        }
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const seedData = async () => {
    await seedBooks();
    const books = await Book.find() as IBook[];
    await seedUsers(books);
};

export default connectMongoDB;