import { Schema, model, Types, Document } from 'mongoose';

interface IAuthor {
    name: string;
}

interface IBook extends Document {
    _id: Types.ObjectId;
    authors: IAuthor[];
    publisher: string;
    title: string;
    edition?: string;
    cover_id?: string;
    isbn: string;
    isbn10: string;
    isbn13: string;
    subjects: Types.ObjectId[];
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

const bookSchema = new Schema<IBook>(
    {
        authors: [{ type: String, required: true }],
        publisher: { type: String, required: true },
        title: { type: String, required: true },
        edition: { type: String },
        cover_id: { type: String },
        isbn: { type: String, required: true, unique: true },
        isbn10: { type: String },
        isbn13: { type: String },
        subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
        language: { type: String },
        pages: { type: Number },
        publication_date: { type: Date  },
        image: { type: String },
        title_long: { type: String },
        synopsis: { type: String },
        msrp: { type: Number },
        dimensions: { type: String },
        binding: { type: String }
    },
    {
        timestamps: true
    }
);
// Add indexes
bookSchema.index({ title: 1 });
bookSchema.index({ subjects: 1 });
bookSchema.index({ isbn: 1 });
const Book = model<IBook>('Book', bookSchema);

export { Book, IBook };
