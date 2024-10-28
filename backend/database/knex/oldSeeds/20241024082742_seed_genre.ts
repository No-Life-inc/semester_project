import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {

    // Deletes ALL existing entries
    await knex("genre").del();

    // Inserts seed entries
    await knex("genre").insert([
        { name: "Fantasy" },
        { name: "Science Fiction" },
        { name: "Horror" },
        { name: "Mystery" },
        { name: "Romance" },
        { name: "Thriller" },
        { name: "Historical Fiction" },
        { name: "Non-Fiction" },
        { name: "Biography" }
    ]);

};
