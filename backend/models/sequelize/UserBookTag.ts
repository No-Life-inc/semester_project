import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/SqlConfig";

// Define the attributes for the UserBookTag model
interface UserBookTagAttributes {
    id: number;
    userBookId: number;
    tagId: number;
    createdAt?: Date;
}

// Define a type for creation (since `id` will be auto-incremented and optional during creation)
interface UserBookTagCreationAttributes extends Optional<UserBookTagAttributes, "id"> {}

// Define the UserBookTag model
class UserBookTag extends Model<UserBookTagAttributes, UserBookTagCreationAttributes> {
    declare id: number;
    declare userBookId: number;
    declare tagId: number;
    declare createdAt?: Date;
}

// Initialize the model
UserBookTag.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userBookId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "user_book_id",
            references: { model: "user_books", key: "id" },
        },
        tagId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "tag_id",
            references: { model: "tags", key: "id" },
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
