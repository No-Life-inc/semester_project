import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/SqlConfig";
import User from "./User";
import Book from "./Book";

interface UserBookAttributes {
    id?: number;
    user_id: number;
    book_id: number;
    book?: Book;
}

class UserBook extends Model<UserBookAttributes> {}


UserBook.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: User,
                key: "id",
            },
        },
        book_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Book,
                key: "id",
            },
        },
    },
    {
        sequelize,
        modelName: "UserBook",
        tableName: "user_books",
        timestamps: false,
    }
);

export default UserBook;