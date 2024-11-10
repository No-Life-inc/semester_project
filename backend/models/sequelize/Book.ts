import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/SqlConfig";
import User from "./User"; // Import the User model
import UserBook from "./UserBook"; // Import the UserBook model
import Author from "./Author"; // Import the Author model
import Publisher from "./Publisher"; // Import the Publisher model
import Subject from "./Subject"; // Import the Subject model

// Define the attributes for the Book model
interface BookAttributes {
    id: number;
    title: string;
    publisherId: number;
    edition: string;
    coverId: number;
    isbn: string;
    language: string;
    pages: number;
    publicationDate: Date;
    dimensions: string;
    image: string;
    synopsis: string;
    msrp: number;
    isbn10: string;
    isbn13: string;
    binding: string;
    createdAt?: Date;
    users?: User[]; // Add users property for TypeScript
    authors?: Author[]; // Add authors property for TypeScript
    subjects?: Subject[]; // Add subjects property for TypeScript
    publisher?: Publisher; // Add publisher property for TypeScript
}

interface BookCreationAttributes extends Optional<BookAttributes, "id"> {}

class Book extends Model<BookAttributes, BookCreationAttributes> implements BookAttributes {
    public id!: number;
    public title!: string;
    public publisherId!: number;
    public edition!: string;
    public coverId!: number;
    public isbn!: string;
    public language!: string;
    public pages!: number;
    public publicationDate!: Date;
    public dimensions!: string;
    public image!: string;
    public synopsis!: string;
    public msrp!: number;
    public isbn10!: string;
    public isbn13!: string;
    public binding!: string;
    public createdAt?: Date;
    public users?: User[]; // Add users property for TypeScript
    public authors?: Author[]; // Add authors property for TypeScript
    public subjects?: Subject[]; // Add subjects property for TypeScript
    public publisher?: Publisher; // Add publisher property for TypeScript
}

// Initialize the Book model
Book.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        publisherId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "publisher_id",
        },
        edition: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        coverId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "cover_id",
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
            field: "publication_date",
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
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: "created_at",
        },
    },
    {
        sequelize,
        modelName: "Book",
        tableName: "books",
        createdAt: "created_at",
        timestamps: true,
        updatedAt: false,
    }
);


export default Book;