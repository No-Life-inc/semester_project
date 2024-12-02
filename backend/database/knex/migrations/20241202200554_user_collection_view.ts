import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
        CREATE VIEW user_summary AS
        SELECT 
            u.id AS user_id,
            u.name AS user_name,
            COUNT(DISTINCT ub.book_id) AS book_count,
            COUNT(DISTINCT c.id) AS collection_count
        FROM 
            users u
        LEFT JOIN 
            user_books ub ON u.id = ub.user_id
        LEFT JOIN 
            collections c ON u.id = c.user_id
        GROUP BY 
            u.id, u.name;
    `);
}

export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
        DROP VIEW IF EXISTS user_summary;
    `);
}
