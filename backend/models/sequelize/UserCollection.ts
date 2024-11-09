import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/SqlConfig";
import User from "./User";
import Collection from "./Collection";

class UserCollection extends Model {
    public user_id!: number;
    public collection_id!: number;
    public createdAt?: Date;
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
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: "created_at",
        },
    },
    {
        sequelize,
        modelName: "UserCollection",
        tableName: "user_collections",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
    }
);

export default UserCollection;