import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/SqlConfig";
import User from "./User";
import Author from "./Author";
import Publisher from "./Publisher";
import Subject from "./Subject";

export interface BookAttributes {
    id: number;
    title: string;
    titleLong?: string;
    publisherId?: number;
    edition?: string;
    isbn: string;
    language?: string;
    pages?: number;
    publicationDate?: Date;
    dimensions?: string;
    image?: string;
    synopsis?: string;
    msrp?: number;
    isbn10?: string;
    isbn13?: string;
    binding?: string;
    createdAt?: Date;
    users?: User[];
    authors?: Author[];
    subjects?: Subject[];
    publisher?: Publisher;
}

export interface BookCreationAttributes extends Optional<BookAttributes, "id"> {}

class Book extends Model<BookAttributes, BookCreationAttributes> implements BookAttributes {
    public id!: number;
    public title!: string;
    titleLong: string;
    public publisherId!: number;
    public edition!: string;
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
    public users?: User[];
    public authors?: Author[];
    public subjects?: Subject[];
    public publisher?: Publisher;
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
        titleLong: {
            type: DataTypes.STRING,
            allowNull: true,
            field: "title_long",
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
            validate: {
                isDate: true, // Ensures the value is a valid date
            },
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