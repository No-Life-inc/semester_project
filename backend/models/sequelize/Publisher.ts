import { DataTypes, Model } from "sequelize";
import {limitedSequelize} from "../../config/SqlConfig";
import Book from "./Book"; // Import the Book model

interface PublisherAttributes {
    id: number;
    name: string;
    createdAt?: Date;
}

class Publisher extends Model<PublisherAttributes> implements PublisherAttributes {
    declare id: number;
    declare name: string;
    declare books?: Book[]; // Add books property for TypeScript
    declare createdAt?: Date;
}

Publisher.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [0, 255],
            isNotOnlyNumbers(value: string) {
                if (/^\d+$/.test(value)) {
                  throw new Error("Name cannot consist of numbers only.");
                }
              },
              is: {
                args: /^[a-zA-Z0-9\s]+$/i, // Allow alphanumeric characters and spaces
                msg: "Name must only contain alphanumeric characters and spaces.",
              },
        },
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "created_at",
    },
}, {
    sequelize: limitedSequelize,
    tableName: "publishers",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
});

export default Publisher;