import sequelize from "./SqlConfig";
import AuditLog from "../models/sequelize/AuditLog";

export function registerHooks() {
    sequelize.addHook("afterCreate", async (instance, options) => {
        if (instance.constructor.name === "AuditLog") {
            return;
        }

        console.log("afterCreate hook triggered");

        try {
            await AuditLog.create({
                table_name: instance.constructor.name,
                operation: "CREATE",
                record_id: instance.get("id") as number,
                timestamp: sequelize.fn("GETDATE") as unknown as Date,
            });
        } catch (error) {
            console.error("Error logging afterCreate hook:", error);
        }
    });

    sequelize.addHook("afterUpdate", async (instance, options) => {
        if (instance.constructor.name === "AuditLog") {
            return;
        }

        console.log("afterUpdate hook triggered");

        try {
            await AuditLog.create({
                table_name: instance.constructor.name,
                operation: "UPDATE",
                record_id: instance.get("id") as number,
                timestamp: sequelize.fn("GETDATE") as unknown as Date,
            });
        } catch (error) {
            console.error("Error logging afterUpdate hook:", error);
        }
    });

    sequelize.addHook("afterDestroy", async (instance, options) => {
        if (instance.constructor.name === "AuditLog") {
            return;
        }

        console.log("afterDestroy hook triggered");

        try {
            await AuditLog.create({
                table_name: instance.constructor.name,
                operation: "DELETE",
                record_id: instance.get("id") as number,
                timestamp: sequelize.fn("GETDATE") as unknown as Date,
            });
        } catch (error) {
            console.error("Error logging afterDestroy hook:", error);
        }
    });
}
