import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/SqlConfig";

// Define the attributes for the BookModel.ts model
interface BookAttributes {
    id: number;
    authorId: number;
    publisherId: number;
    title: string;
    longTitle: string;
    edition: number;
    coverId: number;
    isbn: string;
    isbn10: string;
    isbn13: string;
    binding: string;
    language: string;
    pages: number;
    publicationDate: Date;
    dimensions: string;
    image: string;
}

// Define a type for creation (since `id` will be auto-incremented and optional during creation)
interface BookCreationAttributes extends Optional<BookAttributes, "id"> {}

// Define the BookModel.ts model extending Sequelize's Model with typed attributes
class Book extends Model<BookAttributes, BookCreationAttributes> implements BookAttributes {
    public id!: number;
    public authorId!: number;
    public publisherId!: number;
    public title!: string;
    public edition!: string;
    public coverId!: number;
    public isbn!: string;
    public language!: string;
    public pages!: number;
    public publicationDate!: Date;
    public longTitle!: string;
    public isbn10!: string;
    public isbn13!: string;
    public binding!: string;
    public dimensions!: string;
    public image!: string;

}

// Initialize the model
Book.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        authorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        publisherId: {
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
        coverId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        isbn: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        language: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        pages: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        publicationDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        longTitle: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isbn10: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isbn13: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        binding: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        dimensions: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
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
