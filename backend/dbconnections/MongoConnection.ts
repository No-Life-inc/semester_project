import mongoose from 'mongoose';
import  '../models/mongoose/BookModel';
import '../models/mongoose/UserModel';
import seedBooks from '../database/mongoose/seed_books';
import seedUsers from '../database/mongoose/seed_users';
import {IBook, Book} from "../models/mongoose/BookModel";


const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        await mongoose.connect(uri);
        console.log('MongoDB connected');

        await seedData();
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Seed-funktion
const seedData = async () => {
    await seedBooks();
    const books = await Book.find() as IBook[]
    await seedUsers(books); // Send books til seedUsers
};

export default connectDB;