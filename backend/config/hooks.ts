import { sequelize, limitedSequelize } from "./SqlConfig";
import AuditLog from "../models/sequelize/AuditLog";

export function registerHooks() {
  const instances = [sequelize, limitedSequelize];

  instances.forEach((sequelizeInstance) => {
    sequelizeInstance.addHook("afterCreate", async (instance, options) => {
      if (instance.constructor.name === "AuditLog") {
        return;
      }

      const recordId = (instance.get("id") || instance.get("userBookId")) as number;

      if (recordId === null || recordId === undefined) {
        console.warn(
          `afterCreate hook (${sequelizeInstance.config.database}): record_id is null or undefined for instance:`,
          instance
        );
        return;
      }

      console.log(`afterCreate hook triggered on ${sequelizeInstance.config.database}`);

      try {
        await AuditLog.create(
          {
            table_name: instance.constructor.name,
            operation: "CREATE",
            record_id: recordId,
            timestamp: sequelizeInstance.fn("GETDATE") as unknown as Date,
          },
          { transaction: options.transaction }
        );
      } catch (error) {
        console.error(`Error logging afterCreate hook on ${sequelizeInstance.config.database}:`, error);
      }
    });

    sequelizeInstance.addHook("afterUpdate", async (instance, options) => {
      if (instance.constructor.name === "AuditLog") {
        return;
      }

      console.log(`afterUpdate hook triggered on ${sequelizeInstance.config.database}`);

      try {
        await AuditLog.create({
          table_name: instance.constructor.name,
          operation: "UPDATE",
          record_id: instance.get("id") as number,
          timestamp: sequelizeInstance.fn("GETDATE") as unknown as Date,
        });
      } catch (error) {
        console.error(`Error logging afterUpdate hook on ${sequelizeInstance.config.database}:`, error);
      }
    });

    sequelizeInstance.addHook("afterDestroy", async (instance, options) => {
      if (instance.constructor.name === "AuditLog") {
        return;
      }

      const recordId = (instance.get("id") || instance.get("userBookId")) as number;

      if (recordId === null || recordId === undefined) {
        console.warn(
          `afterDestroy hook (${sequelizeInstance.config.database}): record_id is null or undefined for instance:`,
          instance
        );
        return;
      }

      console.log(`afterDestroy hook triggered on ${sequelizeInstance.config.database}`);

      try {
        await AuditLog.create(
          {
            table_name: instance.constructor.name,
            operation: "DELETE",
            record_id: recordId,
            timestamp: sequelizeInstance.fn("GETDATE") as unknown as Date,
          },
          { transaction: options.transaction }
        );
      } catch (error) {
        console.error(`Error logging afterDestroy hook on ${sequelizeInstance.config.database}:`, error);
      }
    });
  });
}
