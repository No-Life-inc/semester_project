import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../config/SqlConfig";

interface SubjectAttributes {
    id: number;
    name: string;
}

interface SubjectCreationAttributes extends Optional<SubjectAttributes, "id"> {}

class Subject extends Model<SubjectAttributes, SubjectCreationAttributes> implements SubjectAttributes {
  public id!: number;
  public name!: string;
}

Subject.init({
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
    tableName: "subjects", // Update the table name if necessary
    timestamps: false,
});

export default Subject;