import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Trigger for INSERT
  await knex.schema.raw(`
        CREATE TRIGGER UpdateBookStatsOnInsert
ON dbo.collection_books
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Hent book_id fra dbo.user_books baseret på user_book_id
    IF EXISTS (SELECT 1 FROM dbo.book_stats WHERE book_id = (SELECT ub.book_id 
                                                             FROM dbo.user_books ub 
                                                             WHERE ub.id = (SELECT user_book_id FROM inserted)))
    BEGIN
        UPDATE dbo.book_stats
        SET collection_count = collection_count + 1,
            updated_at = GETDATE()
        WHERE book_id = (SELECT ub.book_id 
                         FROM dbo.user_books ub 
                         WHERE ub.id = (SELECT user_book_id FROM inserted));
    END
    ELSE
    BEGIN
        INSERT INTO dbo.book_stats (book_id, collection_count, created_at, updated_at)
        SELECT ub.book_id, 1, GETDATE(), GETDATE()
        FROM dbo.user_books ub
        WHERE ub.id = (SELECT user_book_id FROM inserted);
    END
END;

    `);

  // Trigger for DELETE
  await knex.schema.raw(`
    CREATE TRIGGER UpdateBookStatsOnDelete
ON dbo.collection_books
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Hent book_id fra dbo.user_books baseret på user_book_id
    IF EXISTS (SELECT 1 FROM dbo.book_stats WHERE book_id = (SELECT ub.book_id 
                                                             FROM dbo.user_books ub 
                                                             WHERE ub.id = (SELECT user_book_id FROM deleted)))
    BEGIN
        UPDATE dbo.book_stats
        SET collection_count = collection_count - 1,
            updated_at = GETDATE()
        WHERE book_id = (SELECT ub.book_id 
                         FROM dbo.user_books ub 
                         WHERE ub.id = (SELECT user_book_id FROM deleted));

        -- Slet fra book_stats, hvis collection_count når 0
        DELETE FROM dbo.book_stats
        WHERE book_id = (SELECT ub.book_id 
                         FROM dbo.user_books ub 
                         WHERE ub.id = (SELECT user_book_id FROM deleted)) 
          AND collection_count <= 0;
    END
END;
    `);
}

export async function down(knex: Knex): Promise<void> {
  // Drop triggers
  await knex.schema.raw(`DROP TRIGGER IF EXISTS UpdateBookStatsOnInsert;`);
  await knex.schema.raw(`DROP TRIGGER IF EXISTS UpdateBookStatsOnDelete;`);
}
