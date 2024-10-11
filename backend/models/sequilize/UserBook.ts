import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/SqlConfig";

// Define the attributes for the UserBook model
interface UserBookAttributes {
    id: number;
    user_id: number;
    book_id: number;
}

// Define a type for creation (since `id` will be auto-incremented and optional during creation)
interface UserBookCreationAttributes extends Optional<UserBookAttributes, "id"> {}

// Define the UserBook model
class UserBook extends Model<UserBookAttributes, UserBookCreationAttributes> {}

// Initialize the model
UserBook.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        book_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "UserBook",
        tableName: "user_book",
        timestamps: false,
    }
);

export default UserBook;
