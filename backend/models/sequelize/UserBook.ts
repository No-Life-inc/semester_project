import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/SqlConfig";
import User from "./User";
import Book from "./Book";

class UserBook extends Model {
  public id!: number;
  public user_id!: number;
  public book_id!: number;
}

UserBook.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
