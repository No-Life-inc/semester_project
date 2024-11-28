import { Schema, model, Types, Document } from "mongoose";

interface ISubject extends Document {
    _id: Types.ObjectId;
    name: string;
}

const subjectSchema = new Schema<ISubject>(
    {
        name: { type: String, required: true, unique: true },
    },
    {
        timestamps: true,
    }
);

const Subject = model<ISubject>("Subject", subjectSchema);

export { Subject, ISubject };
