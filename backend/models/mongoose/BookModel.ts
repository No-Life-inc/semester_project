import { Schema, model, Types, Document } from 'mongoose';
import {User} from "./UserModel";

export interface IAuthor {
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
        subjects: [{name: { type: String, required: true }}],
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

bookSchema.post('findOneAndUpdate', async function (doc) {
    if (!doc) return;

    const updatedBook = doc.toObject();
    const { _id, authors, publisher, title, edition, cover_id, isbn, isbn10, isbn13, subjects, language, pages, publication_date, image, title_long, synopsis, msrp, dimensions, binding } = updatedBook;

    try {

        const users = await User.find({ 'books.book_id': _id });

        for (const user of users) {
            user.books.forEach((userBook) => {
                if (userBook.book_id.toString() === _id.toString()) {
                    userBook.embeddedBook = {
                        authors,
                        publisher,
                        title,
                        edition,
                        cover_id,
                        isbn,
                        isbn10,
                        isbn13,
                        subjects,
                        language,
                        pages,
                        publication_date,
                        image,
                        title_long,
                        synopsis,
                        msrp,
                        dimensions,
                        binding,
                    };
                }
            });
            await user.save();
        }

        console.log(`Users updated successfully for book ID ${_id}`);
    } catch (error) {
        console.error('Error syncing book updates to users:', error);
    }
});



// Add indexes
bookSchema.index({ title: 1 });
bookSchema.index({ subjects: 1 });
//bookSchema.index({ isbn: 1 });




const Book = model<IBook>('Book', bookSchema);

export { Book, IBook };
