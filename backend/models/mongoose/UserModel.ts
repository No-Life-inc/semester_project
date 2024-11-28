import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUserBook {
    book_id: Types.ObjectId; // Reference to Book
    tags: string[];
}

interface ICollection {
    _id?: Types.ObjectId;
    name: string;
    books: Types.ObjectId[]; // Reference to Books
}

interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    books: IUserBook[];
    collections: ICollection[];
    createdAt?: Date;

    comparePassword(candidatePassword: string): Promise<boolean>;

}

// Define schema
const userSchema = new Schema<IUser>(
    {
        _id: { type: Schema.Types.ObjectId, auto: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true},
        password: { type: String, required: true, select: false },
        books: [
            {
                book_id: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
                tags: [{ type: String }],
            },
        ],
        collections: [
            {
                name: { type: String, required: true },
                books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
            },
        ],
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: false },
    }
);

// Password hashing middleware
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

const User = model<IUser>('User', userSchema);

export { User, IUser };
