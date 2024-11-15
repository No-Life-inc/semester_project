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
            validate: {
                len: [0, 255], 
                notNull: true,
            },
        },
        titleLong: {
            type: DataTypes.STRING,
            allowNull: true,
            field: "title_long",
            validate: {
                len: [0, 255],
            },
        },
        publisherId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "publisher_id",
        },
        edition: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                len: [0, 255], 
            },
        },
        isbn: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [0, 10],
                notEmpty: true,
            },
        },
        language: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [0, 255], 
            },
        },
        pages: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 0,
                max: 2147483647,
            },
        },
        publicationDate: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "publication_date",
            validate: {
                isDate: true, 
                isAfter: "0001-01-02",
                isBefore: "9999-12-31",
            },
        },
        dimensions: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [0, 255], 
            },
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [0, 255], 
            },
        },
        synopsis: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [0, 255], 
            },
        },
        msrp: {
            type: DataTypes.FLOAT,
            allowNull: true,
            validate: {
                min: 0,
                max: 99999999.99, 
            },
        },
        isbn10: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [0, 10]
            },
        },
        isbn13: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [0, 13]
            },
        },
        binding: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [0, 255], // Ensures the value is between 1 and 255 characters
            },
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