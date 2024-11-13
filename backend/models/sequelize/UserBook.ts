import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/SqlConfig";
import User from "./User";
import Book from "./Book";

class UserBook extends Model {
  public id!: number;
  public userId!: number;
  public book_id!: number;
  public createdAt?: Date;
}

UserBook.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "user_id",
      references: {
        model: User,
        key: "id",
      },
    },
    bookId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: "book_id",
      references: {
        model: Book,
        key: "id",
      },
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
    modelName: "UserBook",
    tableName: "user_books",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

export default UserBook;
