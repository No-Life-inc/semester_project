import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/SqlConfig";

// Define the attributes for the Author model
interface AuthorAttributes {
    id: number;
    name: string;
    createdAt?: Date;
}

// Define a type for creation (since `id` will be auto-incremented and optional during creation)
interface AuthorCreationAttributes extends Optional<AuthorAttributes, "id"> {}

// Define the Author model extending Sequelize's Model with typed attributes
class Author extends Model<AuthorAttributes, AuthorCreationAttributes> implements AuthorAttributes {
    public id!: number;
    public name!: string;
    public createdAt?: Date;
}

// Initialize the model
Author.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [0, 255],
                isNotOnlyNumbers(value: any) {
                    if (/^-?\d+$/.test(value)) { 
                      // Matches strings that are entirely numeric, optionally with a leading '-'
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
            allowNull: true,
            defaultValue: DataTypes.NOW,
            field: "created_at",
        },
    },
    {
        sequelize,
        modelName: "Author",
        tableName: "authors",
        timestamps: true, // Disable timestamps if not needed
        createdAt: "created_at",
        updatedAt: false,
    }
);

export default Author;
