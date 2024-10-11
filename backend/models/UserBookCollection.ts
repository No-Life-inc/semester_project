import { DataTypes, Model } from "sequelize";
import sequelize from "../config/SqlConfig";

// Define the attributes for the UserBookCollection model
interface UserBookCollectionAttributes {
    id: number;
    collection_id: number;
    user_book_id: number;
}

class UserBookCollection extends Model<UserBookCollectionAttributes> implements UserBookCollectionAttributes {
    public id!: number;
    public collection_id!: number;
    public user_book_id!: number;
}

// Initialize the UserBookCollection model
UserBookCollection.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        collection_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'collections', key: 'id' },
            onDelete: 'CASCADE',
        },
        user_book_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'user_books', key: 'id' },
            onDelete: 'CASCADE',
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
