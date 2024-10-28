import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/SqlConfig";
import User from "./User";
import Collection from "./Collection";

class UserCollection extends Model {
    public user_id!: number;
    public collection_id!: number;
}

UserCollection.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: User,
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
        modelName: "UserCollection",
        tableName: "user_collections",
        timestamps: false,
    }
);

export default UserCollection;