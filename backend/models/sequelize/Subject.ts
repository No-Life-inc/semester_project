import { DataTypes, Model, Optional } from "sequelize";
import {sequelize} from "../../config/SqlConfig";

interface SubjectAttributes {
    id: number;
    name: string;
    createdAt?: Date;
}

interface SubjectCreationAttributes extends Optional<SubjectAttributes, "id"> {}

class Subject extends Model<SubjectAttributes, SubjectCreationAttributes> implements SubjectAttributes {
    declare id: number;
    declare name: string;
    declare createdAt?: Date;
}

Subject.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: "id",
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          notNull: true,
          len: [1, 255]
        },
        field: "name",
      },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "created_at",
    },
}, {
    sequelize: sequelize,
    tableName: "subjects", 
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
});

export default Subject;