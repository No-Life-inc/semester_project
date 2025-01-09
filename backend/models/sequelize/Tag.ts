import { DataTypes, Model, Optional } from "sequelize";
import {sequelize} from "../../config/SqlConfig";

// Define the attributes for the Tag model
interface TagAttributes {
    id: number;
    name: string;
    createdAt?: Date;
}

// Define a type for creation (since `id` will be auto-incremented and optional during creation)
interface TagCreationAttributes extends Optional<TagAttributes, "id"> {}

// Define the Tag model
class Tag extends Model<TagAttributes, TagCreationAttributes> {
    declare id: number;
    declare name: string;
    declare createdAt?: Date;
}

// Initialize the model
Tag.init(
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
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: "created_at",
        },
    },
    {
        sequelize: sequelize,
        modelName: "Tag",
        tableName: "tags",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
    }
);

export default Tag;
