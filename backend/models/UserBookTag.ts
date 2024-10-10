import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/SqlConfig";

// Define the attributes for the UserBookTag model
interface UserBookTagAttributes {
    id: number;
    user_book_id: number;
    tag_id: number;
}

// Define a type for creation (since `id` will be auto-incremented and optional during creation)
interface UserBookTagCreationAttributes extends Optional<UserBookTagAttributes, "id"> {}

// Define the UserBookTag model
class UserBookTag extends Model<UserBookTagAttributes, UserBookTagCreationAttributes> {}

// Initialize the model
UserBookTag.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_book_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tag_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "UserBookTag",
        tableName: "user_book_tags",
        timestamps: false,
    }
);

export default UserBookTag;
