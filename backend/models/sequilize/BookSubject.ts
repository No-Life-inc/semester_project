import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/SqlConfig";

interface BookSubjectAttributes {
    id: number;
    book_id: number;
    subject_id: number;
}

interface BookSubjectCreationAttributes extends Optional<BookSubjectAttributes, "id"> {}

class BookSubject extends Model<BookSubjectAttributes, BookSubjectCreationAttributes> implements BookSubjectAttributes {
    public id!: number;
    public book_id!: number;
    public subject_id!: number;
}

BookSubject.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'books', key: 'id' },
        onDelete: 'CASCADE',
    },
    subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'subjects', key: 'id' }, // Update the reference model name
        onDelete: 'CASCADE',
    },
}, {
    sequelize,
    modelName: "BookSubject",
    tableName: "book_subjects", // Update the table name if necessary
    timestamps: false,
});

export default BookSubject;