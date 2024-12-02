import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        CREATE FUNCTION get_top_authors(@top_count INT)
        RETURNS TABLE
        AS
        RETURN
        (
            WITH AuthorPopularity AS (
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
            SELECT TOP (@top_count)
                author_id,
                popularity,
                GETDATE() AS updated_at 
            FROM
                AuthorPopularity
            ORDER BY
                popularity DESC
        );
    `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
        DROP FUNCTION IF EXISTS get_top_authors;
    `);
}