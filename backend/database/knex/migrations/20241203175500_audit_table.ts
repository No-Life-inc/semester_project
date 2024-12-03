import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("audit_logs", (table) => {
    table.increments("id").primary(); // Unique ID for each audit log
    table.string("table_name").notNullable(); // Name of the table being logged
    table.string("operation").notNullable(); // Type of operation: INSERT, UPDATE, DELETE
    table.integer("record_id").notNullable(); // ID of the affected record
    table.json("old_values"); // Previous values (for updates/deletes)
    table.json("new_values"); // New values (for inserts/updates)
    table.timestamp("timestamp").defaultTo(knex.fn.now()); // When the operation occurred
    table.string("user_id"); // ID of the user who performed the operation, if available
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("audit_logs");
}
