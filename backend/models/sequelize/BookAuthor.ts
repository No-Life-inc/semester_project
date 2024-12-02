import {DataTypes, Model, Optional} from "sequelize";
import sequelize from "../../config/SqlConfig";

interface BookAuthorAttributes {
    id: number;
    bookId: number;
    authorId: number;
    createdAt?: Date;
}

interface BookAuthorCreationAttributes extends Optional<BookAuthorAttributes, "id"> {}

class  BookAuthor extends Model <BookAuthorAttributes, BookAuthorCreationAttributes> implements BookAuthorAttributes {
    declare id: number;
    declare bookId: number;
    declare authorId: number;
    declare createdAt?: Date;
}

BookAuthor.init(
    {
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
        authorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'authors', key: 'id' },
            onDelete: 'CASCADE',
            field: "author_id",
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: "created_at",
        },
    },
    {
        sequelize,
        modelName: "BookAuthor",
        tableName: "book_authors",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
    }
);
