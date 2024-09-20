import { DataTypes, Model } from "sequelize";
import sequelize from "../config/SqlConfig";
import Book from "./Book";
import Author from "./Author";

class BooksHasAuthors extends Model {}

// Initialize the model
BooksHasAuthors.init({
    book_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Book, // Reference to the Book model
            key: "id"
        },
    },
    author_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Author, // Reference to the Author model
            key: "id"
        },
    }
}, {
    sequelize, // Pass the sequelize instance
    tableName: "books_has_authors",
    timestamps: false // Disable timestamps if not needed
});

export default BooksHasAuthors;
