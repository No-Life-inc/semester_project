import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/SqlConfig";
import Book from "./Book"; // Import the Book model

interface PublisherAttributes {
    id: number;
    name: string;
}

class Publisher extends Model<PublisherAttributes> implements PublisherAttributes {
    public id!: number;
    public name!: string;
    public books?: Book[]; // Add books property for TypeScript
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
    }
}, {
    sequelize,
    tableName: "publishers",
    timestamps: false
});

export default Publisher;