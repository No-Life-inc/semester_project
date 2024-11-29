import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        CREATE OR ALTER PROCEDURE update_most_popular_author
        AS
        BEGIN
            -- Variabel deklaration
            DECLARE @top_author_id INT;
            DECLARE @top_score INT;

            -- Beregn forfatterens popularitet baseret på antal brugere, der har tilføjet deres bøger til samlinger
            SELECT TOP 1
                @top_author_id = ba.author_id,
                @top_score = COUNT(DISTINCT ubc.collection_id)
            FROM
                book_authors ba
            INNER JOIN
                user_books ub ON ba.book_id = ub.book_id
            INNER JOIN
                collection_books ubc ON ub.id = ubc.user_book_id
            GROUP BY
                ba.author_id
            ORDER BY
                COUNT(DISTINCT ubc.collection_id) DESC;

            -- Ryd tabellen og indsæt de nye data
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
