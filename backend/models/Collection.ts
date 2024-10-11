import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/SqlConfig";

// Define the attributes for the Collection model
interface CollectionAttributes {
    id: number;
    name: string;
}

interface CollectionCreationAttributes extends Optional<CollectionAttributes, "id"> {}

class Collection extends Model<CollectionAttributes, CollectionCreationAttributes> implements CollectionAttributes {
    public id!: number;
    public name!: string;
}

// Initialize the Collection model
Collection.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Collection",
        tableName: "collections",
        timestamps: false,
    }
);

export default Collection;
