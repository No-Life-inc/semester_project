import {DataTypes, Model, Optional} from "sequelize";
import sequelize from "../../config/SqlConfig";

interface GenreAttributes {
    id: number;
    name: string;
}

interface GenreCreationAttributes extends Optional<GenreAttributes, "id"> {}

class Genre extends Model<GenreAttributes, GenreCreationAttributes> implements GenreAttributes {
  public id!: number;
  public name!: string;
}

Genre.init({
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
    tableName: "genres",
    timestamps: false,
});

export default Genre;