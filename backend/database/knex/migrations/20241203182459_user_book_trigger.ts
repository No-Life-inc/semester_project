import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
      CREATE TRIGGER trg_Audit_userBook
      ON dbo.user_books
      AFTER INSERT
      AS
      BEGIN
          SET NOCOUNT ON;
  
          -- Insert log for INSERT operations
          IF EXISTS (SELECT * FROM inserted)
          BEGIN
              INSERT INTO dbo.audit_logs (table_name, operation, record_id, new_values, timestamp)
              SELECT
                  'user_books' AS table_name,
                  'INSERT' AS operation,
                  inserted.id AS record_id,
                  (SELECT * FROM inserted FOR JSON PATH) AS new_values,
                  GETDATE() AS timestamp
              FROM inserted;
          END
      END;
    `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP TRIGGER IF EXISTS trg_Audit_userBook;`);
}
