import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex('most_popular_author').truncate();

    const randomAuthor = await knex("authors").select("id").first();

    await knex("most_popular_author").insert([
        { author_id: randomAuthor.id, popularity: 100 },
    ]);
}
