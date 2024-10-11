import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/SqlConfig";

// Define the attributes for the BookModel.ts model
interface BookAttributes {
    id: number;
    author_id: number;
    publisher_id: number;
    title: string;
    edition: string;
    cover_id: number;
    isbn: string;
    genre: string;
    language: string;
    page_num: number;
    publication_date: Date;
}

// Define a type for creation (since `id` will be auto-incremented and optional during creation)
interface BookCreationAttributes extends Optional<BookAttributes, "id"> {}

// Define the BookModel.ts model extending Sequelize's Model with typed attributes
class Book extends Model<BookAttributes, BookCreationAttributes> implements BookAttributes {
    public id!: number;
    public author_id!: number;
    public publisher_id!: number;
    public title!: string;
    public edition!: string;
    public cover_id!: number;
    public isbn!: string;
    public genre!: string;
    public language!: string;
    public page_num!: number;
    public publication_date!: Date;
}

// Initialize the model
Book.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        author_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        publisher_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        edition: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cover_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        isbn: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        genre: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        language: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        page_num: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        publication_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Book",
        tableName: "books",
        timestamps: false,
    }
);

export default Book;
