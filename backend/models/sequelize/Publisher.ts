import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/SqlConfig";
import Book from "./Book"; // Import the Book model

interface PublisherAttributes {
    id: number;
    name: string;
    createdAt?: Date;
}

class Publisher extends Model<PublisherAttributes> implements PublisherAttributes {
    public id!: number;
    public name!: string;
    public books?: Book[]; // Add books property for TypeScript
    public createdAt?: Date;
}

Publisher.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "created_at",
    },
}, {
    sequelize,
    tableName: "publishers",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
});

export default Publisher;