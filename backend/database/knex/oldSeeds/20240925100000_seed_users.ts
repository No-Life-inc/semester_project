import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("users").del();

  await knex("users").insert([
    { name: "John Doe", email: "john@doe.com"},
    { name: "Jane Smith", email: "Jane@Smith.com" },
    { name: "Alice Johnson",email: "Alice@Johnson.com" },
  ]);
} 
