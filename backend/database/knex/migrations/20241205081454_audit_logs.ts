import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    CREATE TABLE audit_logs (
        id INT IDENTITY PRIMARY KEY,
        table_name NVARCHAR(255) NOT NULL,
        operation NVARCHAR(50) NOT NULL,
        record_id INT NOT NULL,         
        timestamp DATETIME NOT NULL
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(`DROP TABLE IF EXISTS audit_logs;`);
}
