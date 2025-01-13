import { DataTypes, Model, Optional } from "sequelize";
import {sequelize} from "../../config/SqlConfig";
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
    declare id: number;
    declare title: string;
    declare titleLong: string;
    declare publisherId: number;
    declare edition: string;
    declare isbn: string;
    declare language: string;
    declare pages: number;
    declare publicationDate: Date;
    declare dimensions: string;
    declare image: string;
    declare synopsis: string;
    declare msrp: number;
    declare isbn10: string;
    declare isbn13: string;
    declare binding: string;
    declare createdAt?: Date;
    declare users?: User[];
    declare authors?: Author[];
    declare subjects?: Subject[];
    declare publisher?: Publisher;
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
                len: [0, 13],
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
                len: [0, 2147483647], 
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
                len: [0, 255], 
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
        sequelize: sequelize,
        modelName: "Book",
        tableName: "books",
        createdAt: "created_at",
        timestamps: true,
        updatedAt: false,
    }
);

export default Book;