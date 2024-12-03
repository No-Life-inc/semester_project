import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
      CREATE TRIGGER trg_Audit_users
      ON dbo.users
      AFTER INSERT, UPDATE, DELETE
      AS
      BEGIN
          SET NOCOUNT ON;
  
          -- Insert log for INSERT operations
          IF EXISTS (SELECT * FROM inserted)
          BEGIN
              INSERT INTO dbo.audit_logs (table_name, operation, record_id, new_values, timestamp)
              SELECT
                  'users' AS table_name,
                  'INSERT' AS operation,
                  inserted.id AS record_id,
                  (SELECT * FROM inserted FOR JSON PATH) AS new_values,
                  GETDATE() AS timestamp
              FROM inserted;
          END
  
          -- Insert log for UPDATE operations
          IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
          BEGIN
              INSERT INTO dbo.audit_logs (table_name, operation, record_id, old_values, new_values, timestamp)
              SELECT
                  'users' AS table_name,
                  'UPDATE' AS operation,
                  inserted.id AS record_id,
                  (SELECT * FROM deleted FOR JSON PATH) AS old_values,
                  (SELECT * FROM inserted FOR JSON PATH) AS new_values,
                  GETDATE() AS timestamp
              FROM inserted
              JOIN deleted ON inserted.id = deleted.id;
          END
  
          -- Insert log for DELETE operations
          IF EXISTS (SELECT * FROM deleted) AND NOT EXISTS (SELECT * FROM inserted)
          BEGIN
              INSERT INTO dbo.audit_logs (table_name, operation, record_id, old_values, timestamp)
              SELECT
                  'users' AS table_name,
                  'DELETE' AS operation,
                  deleted.id AS record_id,
                  (SELECT * FROM deleted FOR JSON PATH) AS old_values,
                  GETDATE() AS timestamp
              FROM deleted;
          END
      END;
    `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TRIGGER IF EXISTS trg_Audit_users;`);
}
