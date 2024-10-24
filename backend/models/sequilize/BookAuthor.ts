import {DataTypes, Model, Optional} from "sequelize";
import sequelize from "../../config/SqlConfig";

interface BookAuthorAttributes {
    id: number;
    book_id: number;
    author_id: number;
}

interface BookAuthorCreationAttributes extends Optional<BookAuthorAttributes, "id"> {}


class  BookAuthor extends Model <BookAuthorAttributes, BookAuthorCreationAttributes> implements BookAuthorAttributes {
    public id!: number;
    public book_id!: number;
    public author_id!: number;
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
    },
    {
        sequelize,
        modelName: "BookAuthor",
        tableName: "book_author",
        timestamps: false,
    }
);
)