import { DataTypes, Model, Optional } from "sequelize";
import {limitedSequelize} from "../../config/SqlConfig";
import User from "./User"; // Import the User model
import UserBook from "./UserBook"; // Import the UserBook model

// Define the attributes for the Collection model
interface CollectionAttributes {
    id: number;
    name: string;
    userId: number;
    user?: User; // Add user property for TypeScript
    userBooks?: UserBook[]; // Add user_books property for TypeScript
    createdAt?: Date;
}

interface CollectionCreationAttributes extends Optional<CollectionAttributes, "id"> {}

class Collection extends Model<CollectionAttributes, CollectionCreationAttributes> implements CollectionAttributes {
    declare id: number;
    declare name: string;
    declare userId: number;
    declare user?: User; // Add user property for TypeScript
    declare userBooks?: UserBook[]; // Add user_books property for TypeScript
    declare createdAt?: Date;
}

// Initialize the Collection model
Collection.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                notNull: {
                    msg: "Name cannot be null",
                }
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: "users", key: "id" },
            onDelete: "CASCADE",
            field: "user_id",
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: "created_at",
        },
    },
    {
        sequelize: limitedSequelize,
        modelName: "Collection",
        tableName: "collections",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
    }
);

export default Collection;