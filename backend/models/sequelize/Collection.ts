import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/SqlConfig";
import User from "./User"; // Import the User model
import UserCollection from "./UserCollection"; // Import the UserCollection model
import UserBook from "./UserBook"; // Import the UserBook model
import UserBookCollection from "./UserBookCollection"; // Import the UserBookCollection model

// Define the attributes for the Collection model
interface CollectionAttributes {
    id: number;
    name: string;
    users?: User[]; // Add users property for TypeScript
    userBooks?: UserBook[]; // Add user_books property for TypeScript
}

interface CollectionCreationAttributes extends Optional<CollectionAttributes, "id"> {}

class Collection extends Model<CollectionAttributes, CollectionCreationAttributes> implements CollectionAttributes {
    public id!: number;
    public name!: string;
    public users?: User[]; // Add users property for TypeScript
    public userBooks?: UserBook[]; // Add user_books property for TypeScript
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
    },
    {
        sequelize,
        modelName: "Collection",
        tableName: "collections",
        timestamps: false,
    }
);

export default Collection;