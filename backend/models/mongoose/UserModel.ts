import { Schema, model, Document, Types } from 'mongoose';

interface IUserBook {
    book_id: Types.ObjectId;
    tags: string[];
}

interface ICollection {
    name: string;
    books: Types.ObjectId[];
}

interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    books: IUserBook[];
    collections: ICollection[];
}

const userSchema = new Schema<IUser>({
    _id: { type: Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    books: [
        {
            book_id: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
            tags: [{ type: String }]
        }
    ],
    collections: [
        {
            name: { type: String, required: true },
            books: [{ type: Schema.Types.ObjectId, ref: 'Book' }]
        }
    ]
});

const User = model<IUser>('User', userSchema);

export { User, IUser };
