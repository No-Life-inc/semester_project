import { DataTypes, Model } from "sequelize";
import {sequelize} from "../../config/SqlConfig";
import UserBook from "./UserBook";
import Collection from "./Collection";

class UserBookCollection extends Model {
    declare userBookId: number;
    declare collection_id: number;
    declare createdAt?: Date;
}

UserBookCollection.init(
    {
        userBookId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: "user_book_id",
            references: {
                model: UserBook,
                key: "id",
            },
        },
        collection_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            field: "collection_id",
            references: {
                model: Collection,
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
        sequelize: sequelize,
        modelName: "UserBookCollection",
        tableName: "collection_books",
        timestamps: false,
        createdAt: "created_at",
        updatedAt: false,
        hasTrigger: true,
    }
);

export default UserBookCollection;