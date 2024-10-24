import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/SqlConfig";

// Define the attributes for the UserCollection model
interface UserCollectionAttributes {
    id: number;
    user_id: number;
    collection_id: number;
}

class UserCollection extends Model<UserCollectionAttributes> implements UserCollectionAttributes {
    public id!: number;
    public user_id!: number;
    public collection_id!: number;
}

// Initialize the UserCollection model
UserCollection.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE',
        },
        collection_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'collections', key: 'id' },
            onDelete: 'CASCADE',
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
