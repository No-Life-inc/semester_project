import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    CREATE TRIGGER UpdateBookStatsOnInsert
ON dbo.collection_books
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;


    MERGE dbo.book_stats AS target
    USING (
        SELECT DISTINCT ub.book_id
        FROM dbo.user_books ub
        INNER JOIN inserted i ON ub.id = i.user_book_id
    ) AS source (book_id)
    ON target.book_id = source.book_id
    WHEN MATCHED THEN
        UPDATE SET collection_count = collection_count + 1,
                   updated_at = GETDATE()
    WHEN NOT MATCHED THEN
        INSERT (book_id, collection_count, created_at, updated_at)
        VALUES (source.book_id, 1, GETDATE(), GETDATE());
END;
  `);

  await knex.schema.raw(`
    CREATE TRIGGER UpdateBookStatsOnDelete
    ON dbo.collection_books
    AFTER DELETE
    AS
    BEGIN
        SET NOCOUNT ON;

        MERGE dbo.book_stats AS target
        USING (
            SELECT ub.book_id
            FROM dbo.user_books ub
            INNER JOIN deleted d ON ub.id = d.user_book_id
        ) AS source (book_id)
        ON target.book_id = source.book_id
        WHEN MATCHED THEN
            UPDATE SET collection_count = CASE
                WHEN collection_count > 1 THEN collection_count - 1
                ELSE collection_count
            END,
            updated_at = GETDATE()
        WHEN NOT MATCHED BY SOURCE AND collection_count = 1 THEN
            DELETE;
    END;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(`DROP TRIGGER IF EXISTS UpdateBookStatsOnInsert;`);
  await knex.schema.raw(`DROP TRIGGER IF EXISTS UpdateBookStatsOnDelete;`);
}
