import { DataTypes, Model, Optional } from "sequelize";
import {limitedSequelize} from "../../config/SqlConfig";

interface BookSubjectAttributes {
    id: number;
    bookId: number;
    subjectId: number;
    createdAt?: Date;
}

interface BookSubjectCreationAttributes extends Optional<BookSubjectAttributes, "id"> {}

class BookSubject extends Model<BookSubjectAttributes, BookSubjectCreationAttributes> implements BookSubjectAttributes {
    declare id: number;
    declare bookId: number;
    declare subjectId: number;
    declare createdAt?: Date;
}

BookSubject.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'books', key: 'id' },
        onDelete: 'CASCADE',
        field: "book_id",
    },
    subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'subjects', key: 'id' }, // Update the reference model name
        onDelete: 'CASCADE',
        field: "subject_id",
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
        field: "created_at",
    },
}, {
    sequelize: limitedSequelize,
    modelName: "BookSubject",
    tableName: "book_subjects", // Update the table name if necessary
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
});

export default BookSubject;