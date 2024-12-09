import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    CREATE TRIGGER trg_books_audit
    ON books
    FOR INSERT, UPDATE, DELETE
    AS
    BEGIN
      SET NOCOUNT ON;

      DECLARE @operation_type NVARCHAR(50);
      DECLARE @record_id INT;

      IF EXISTS (SELECT * FROM inserted) AND NOT EXISTS (SELECT * FROM deleted)
      BEGIN
        SET @operation_type = 'CREATE';
        SELECT @record_id = id FROM inserted;
      END
      ELSE IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
      BEGIN
        SET @operation_type = 'UPDATE';
        SELECT @record_id = id FROM inserted;
      END
      ELSE IF NOT EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
      BEGIN
        SET @operation_type = 'DELETE';
        SELECT @record_id = id FROM deleted;
      END

      IF @operation_type IS NOT NULL
      BEGIN
        INSERT INTO audit_logs (table_name, operation, record_id, timestamp)
        VALUES ('books', @operation_type, @record_id, GETDATE());
      END
    END;
  `);

  await knex.schema.raw(`DISABLE TRIGGER trg_books_audit ON books;`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(`DROP TRIGGER IF EXISTS trg_books_audit;`);
}
