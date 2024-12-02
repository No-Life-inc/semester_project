import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        CREATE OR ALTER PROCEDURE update_most_popular_author
        AS
        BEGIN
            DECLARE @top_author_id INT;
            DECLARE @top_score INT;

            ;WITH AuthorPopularity AS (
                SELECT 
                    ba.author_id,
                    COUNT(*) AS popularity
                FROM
                    book_authors ba
                INNER JOIN
                    user_books ub ON ba.book_id = ub.book_id
                GROUP BY
                    ba.author_id
            )
            SELECT TOP 1
                @top_author_id = author_id,
                @top_score = popularity
            FROM
                AuthorPopularity
            ORDER BY
                popularity DESC;

            DELETE FROM most_popular_author;

            IF @top_author_id IS NOT NULL
            BEGIN
                INSERT INTO most_popular_author (author_id, popularity, updated_at)
                VALUES (@top_author_id, @top_score, GETDATE());
            END
        END;
    `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.raw(`DROP PROCEDURE IF EXISTS update_most_popular_author;`);
}
