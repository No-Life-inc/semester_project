import { Schema, model, Types, Document } from 'mongoose';

interface IBook extends Document { // Udvid Document for automatisk at inkludere _id
    author: {
        name: string;
    };
    publisher: {
        name: string;
    };
    title: string;
    edition?: string;
    cover_id?: string;
    isbn: string;
    genre: {
        name: string;
    };
    language?: string;
    page_num?: number;
    publication_date?: Date;
    _id: Types.ObjectId; // Tilføj dette felt
}

const bookSchema = new Schema<IBook>({
    author: {
        name: { type: String, required: true }
    },
    publisher: {
        name: { type: String, required: true }
    },
    title: { type: String, required: true },
    edition: { type: String },
    cover_id: { type: String },
    isbn: { type: String, unique: true },
    genre: {
        name: { type: String, required: true }
    },
    language: { type: String },
    page_num: { type: Number },
    publication_date: { type: Date }
});

const Book = model<IBook>('Book', bookSchema);

export { Book, IBook };
