import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex("tags").del();

    await knex("tags").insert([
        { name: "Fiction" },
        { name: "Science Fiction" },
        { name: "Classic" },
        { name: "Adventure" },
    ]);
}
