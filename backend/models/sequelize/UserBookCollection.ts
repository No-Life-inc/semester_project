import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/SqlConfig";
import UserBook from "./UserBook";
import Collection from "./Collection";

class UserBookCollection extends Model {
    public user_book_id!: number;
    public collection_id!: number;
}

UserBookCollection.init(
    {
        user_book_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: UserBook,
                key: "id",
            },
        },
        collection_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: Collection,
                key: "id",
            },
        },
    },
    {
        sequelize,
        modelName: "UserBookCollection",
        tableName: "collection_books",
        timestamps: false,
    }
);

export default UserBookCollection;