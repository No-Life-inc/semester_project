import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/SqlConfig"; // Import the sequelize instance

// Define the attributes for the Author model
interface AuthorAttributes {
    id: number;
    name: string;
}

// Define a type for creation (since `id` will be auto-incremented and optional during creation)
interface AuthorCreationAttributes extends Optional<AuthorAttributes, "id"> {}

// Define the Author model extending Sequelize's Model with typed attributes
class Author extends Model<AuthorAttributes, AuthorCreationAttributes> {}

// Initialize the model
Author.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize, // Pass the sequelize instance
    modelName: "Author", // Name the model
    tableName: "authors", // Specify the table name
    timestamps: false // Disable timestamps if not needed
});

export default Author;
