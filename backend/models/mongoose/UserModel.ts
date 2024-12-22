import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import {IAuthor} from "./BookModel";

export interface IEmbeddedBook {
    authors: IAuthor[];
    publisher: string;
    title: string;
    edition?: string;
    cover_id?: string;
    isbn: string;
    isbn10: string;
    isbn13: string;
    subjects: { name: string }[];
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

interface IUserBook {
    _id?: Types.ObjectId;
    book_id: Types.ObjectId;
    embeddedBook: IEmbeddedBook;
    tags: string[];
}


interface ICollection {
    _id?: Types.ObjectId;
    name: string;
    books: {
        book_id: Types.ObjectId;
        embeddedBook: IEmbeddedBook;
    }[];
}

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    books?: IUserBook[];
    collections?: ICollection[];
    createdAt?: Date;

    comparePassword(candidatePassword: string): Promise<boolean>;
}

const embeddedBookSchema = new Schema<IEmbeddedBook>(
    {
        authors: [{ name: { type: String, required: true } }],
        publisher: { type: String, required: true },
        title: { type: String, required: true },
        edition: { type: String },
        cover_id: { type: String },
        isbn: { type: String, required: true },
        isbn10: { type: String },
        isbn13: { type: String },
        subjects: [{ name: { type: String, required: true } }],
        language: { type: String },
        pages: { type: Number },
        publication_date: { type: Date },
        image: { type: String },
        title_long: { type: String },
        synopsis: { type: String },
        msrp: { type: Number },
        dimensions: { type: String },
        binding: { type: String },
    },
    { _id: false }
);

const userBookSchema = new Schema<IUserBook>(
    {
        book_id: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
        embeddedBook: { type: embeddedBookSchema, required: true },
        tags: [{ type: String }],
    },
    { _id: true }
);

// Collection schema
const collectionSchema = new Schema<ICollection>(
    {
        name: { type: String, required: true },
        books: [
            {
                book_id: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
                embeddedBook: { type: embeddedBookSchema, required: true },
            },
        ],
    },
    { _id: true }
);

const userSchema = new Schema<IUser>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        books: [userBookSchema],
        collections: [collectionSchema],
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: false },
    }
);

userSchema.pre('save', async function (next) {
    const user = this as IUser;
    if (!user.isModified('password')) return next();

    try {
        user.password = await bcrypt.hash(user.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

//userSchema.index({ email: 1 });
//userSchema.index({ "books.book_id": 1 });
//userSchema.index({ "collections.name": 1 });

export const User = model<IUser>('User', userSchema);
