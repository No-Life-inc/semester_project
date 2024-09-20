import { DataTypes, Model } from "sequelize";
import sequelize from "../config/SqlConfig";
import Book from "./Book";
import Author from "./Author";

// Define the junction table as a model
class BooksHasAuthors extends Model {}

// Initialize the model
BooksHasAuthors.init({
    book_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Book, // Ensure the Book model is referenced correctly
            key: "id"
        }
    },
    author_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Author, // Ensure the Author model is referenced correctly
            key: "id"
        }
    }
}, {
    sequelize, // Pass the sequelize instance
    tableName: "books_has_authors",
    timestamps: false // Disable timestamps as per your requirement
});

export default BooksHasAuthors;
