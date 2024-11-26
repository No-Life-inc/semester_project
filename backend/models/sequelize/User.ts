import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/SqlConfig";
import Collection from "./Collection"; // Import the Collection model
import Book from "./Book"; // Import the Book model
import bcrypt from "bcrypt";


// Define the attributes for the User model
interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    collections?: Collection[]; // Add collections property for TypeScript
    books?: Book[]; // Add books property for TypeScript
    createdAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
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
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
        defaultScope: {
            attributes: { exclude: ["password"] },
        },
    }
);

User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

User.beforeUpdate(async (user) => {
    if (user.changed("password")) {
        user.password = await bcrypt.hash(user.password, 10);
    }
});

export default User;