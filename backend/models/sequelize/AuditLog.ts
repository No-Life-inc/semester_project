import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../../config/SqlConfig";

interface AuditLogAttributes {
  id: number;
  table_name: string;
  operation: string;
  record_id: number;
  timestamp: Date;
}

interface AuditLogCreationAttributes extends Optional<AuditLogAttributes, "id"> {}

class AuditLog extends Model<AuditLogAttributes, AuditLogCreationAttributes> implements AuditLogAttributes {
  declare id: number;
  declare table_name: string;
  declare operation: string;
  declare record_id: number;
  declare timestamp: Date;
}

AuditLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    table_name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "table_name",
    },
    operation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    record_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "record_id",
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "AuditLog",
    tableName: "audit_logs",
    timestamps: false,
  }
);

export default AuditLog;
