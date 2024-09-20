import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/SqlConfig";

interface PublisherAttributes {
    id: number;
    name: string;
}

interface PublisherCreationAttributes extends Optional<PublisherAttributes, "id"> {}

class Publisher extends Model<PublisherAttributes, PublisherCreationAttributes> implements PublisherAttributes {
    public id!: number;
    public name!: string;
}

Publisher.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: "publishers",
    timestamps: false,
});

export default Publisher;
