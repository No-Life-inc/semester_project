import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/SqlConfig";

// Define the attributes for the UserBookTag model
interface UserBookTagAttributes {
    id: number;
    user_book_id: number;
    tag_id: number;
    createdAt?: Date;
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
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: "created_at",
        },
    },
    {
        sequelize,
        modelName: "UserBookTag",
        tableName: "user_book_tags",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
    }
);

export default UserBookTag;
