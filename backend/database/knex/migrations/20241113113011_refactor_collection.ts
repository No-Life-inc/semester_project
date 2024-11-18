import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("collections", (table) => {
    table.integer("user_id").unsigned().notNullable();
    table.foreign("user_id").references("users.id");
  });
  await knex.schema.dropTable("user_collections");
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.createTable("user_collections", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.foreign("user_id").references("users.id");
    table.integer("collection_id").unsigned().notNullable();
    table.foreign("collection_id").references("collections.id");
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
  });
  await knex.schema.table("collections", (table) => {
    table.dropForeign(["user_id"]);
    table.dropColumn("user_id");
  });
}
