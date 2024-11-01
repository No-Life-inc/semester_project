import { Schema, model, Types, Document } from 'mongoose';

interface IBook extends Document {
    _id: Types.ObjectId;
    author: {
        name: string;
    }[];
    publisher: string;
    title: string;
    edition?: string;
    cover_id?: string;
    isbn: string;
    isbn10: string;
    isbn13: string;
    subjects: {
        name: string;
    }[];
    language?: string;
    pages?: number;
    publication_date?: Date;
    image?: string;
    title_long?: string;
    synopsis?: string;
    msrp?: number;
    dimensions?: string;
    binding?: string;
}

const bookSchema = new Schema<IBook>({
    author: [
        {
            name: { type: String, required: true }
        }
    ],
    publisher: { type: String, required: true },
    title: { type: String, required: true },
    edition: { type: String },
    cover_id: { type: String },
    isbn: { type: String, required: true },
    isbn10: { type: String, required: true },
    isbn13: { type: String, required: true },
    subjects: [
        {
            name: { type: String, required: true }
        }
    ],
    language: { type: String },
    pages: { type: Number },
    publication_date: { type: Date },
    image: { type: String },
    title_long: { type: String },
    synopsis: { type: String },
    msrp: { type: Number },
    dimensions: { type: String },
    binding: { type: String }
});

const Book = model<IBook>('Book', bookSchema);

export { Book, IBook };
