import { DataTypes, Model } from "sequelize";
import sequelize from "../config/SqlConfig";
import Book from "./Book";
import BookCollection from "./BookCollection";

class BookHasBookCollection extends Model {}

// Initialize the model
BookHasBookCollection.init({
    books_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Book, // Reference to the Book model
            key: "id"
        }
    },
    book_collections_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: BookCollection, // Reference to the BookCollection model
            key: "id"
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "want to read" // Default value for the status field
    }
}, {
    sequelize, // Pass the sequelize instance
    tableName: "books_has_bookcollection",
    timestamps: false // Disable timestamps if not needed
});

export default BookHasBookCollection;
