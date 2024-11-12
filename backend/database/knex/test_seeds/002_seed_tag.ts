import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex("tags").del();

    await knex("tags").insert([
        { name: "Favourites" },
        { name: "Moms smut" },
        { name: "Classic" },
        { name: "Need to read" },
        { name: "Must read" },
        { name: "Later"},
    ]);
}
