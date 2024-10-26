import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/SqlConfig";

// Define the attributes for the Book model
interface BookAttributes {
    id: number;
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
    synopsis: string;
    msrp: number; // Add msrp attribute
}

// Define a type for creation (since `id` will be auto-incremented and optional during creation)
interface BookCreationAttributes extends Optional<BookAttributes, "id"> {}

// Define the Book model extending Sequelize's Model with typed attributes
class Book extends Model<BookAttributes, BookCreationAttributes> implements BookAttributes {
    public id!: number;
    public publisherId!: number;
    public title!: string;
    public longTitle!: string;
    public edition!: number;
    public coverId!: number;
    public isbn!: string;
    public isbn10!: string;
    public isbn13!: string;
    public binding!: string;
    public language!: string;
    public pages!: number;
    public publicationDate!: Date;
    public dimensions!: string;
    public image!: string;
    public synopsis!: string;
    public msrp!: number; // Add msrp attribute
}

// Initialize the model
Book.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        publisherId: {
            type: DataTypes.INTEGER,
            allowNull: true, // Make nullable if publisher_id can be null
            field: "publisher_id", // Map to the correct column name
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        longTitle: {
            type: DataTypes.STRING,
            allowNull: true,
            field: "title_long", // Map to the correct column name
        },
        edition: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        coverId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "cover_id", // Map to the correct column name
        },
        isbn: {
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
            field: "publication_date", // Map to the correct column name
        },
        dimensions: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        synopsis: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        msrp: {
            type: DataTypes.FLOAT,
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