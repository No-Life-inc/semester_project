import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/SqlConfig";
import Collection from "./Collection"; // Import the Collection model
import UserCollection from "./UserCollection"; // Import the UserCollection model
import Book from "./Book"; // Import the Book model
import UserBook from "./UserBook"; // Import the UserBook model

// Define the attributes for the User model
interface UserAttributes {
    id: number;
    name: string;
    email: string;
    collections?: Collection[]; // Add collections property for TypeScript
    books?: Book[]; // Add books property for TypeScript
    createdAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public collections?: Collection[]; // Add collections property for TypeScript
    public books?: Book[]; // Add books property for TypeScript
    public createdAt?: Date;
}

// Initialize the User model
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
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
        modelName: "User",
        tableName: "users",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
    }
);

export default User;