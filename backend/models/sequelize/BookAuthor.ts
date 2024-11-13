import {DataTypes, Model, Optional} from "sequelize";
import sequelize from "../../config/SqlConfig";

interface BookAuthorAttributes {
    id: number;
    book_id: number;
    author_id: number;
    createdAt?: Date;
}

interface BookAuthorCreationAttributes extends Optional<BookAuthorAttributes, "id"> {}


class  BookAuthor extends Model <BookAuthorAttributes, BookAuthorCreationAttributes> implements BookAuthorAttributes {
    public id!: number;
    public book_id!: number;
    public author_id!: number;
    public createdAt?: Date;
}

BookAuthor.init(
    {
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
        author_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'authors', key: 'id' },
            onDelete: 'CASCADE',
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
