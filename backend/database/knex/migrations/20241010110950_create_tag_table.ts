import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("tags", (table) => {
        table.increments("id").primary(); // tilsvarende id: { autoIncrement: true, primaryKey: true }
        table.string("name").notNullable(); // tilsvarende name: { type: DataTypes.STRING, allowNull: false }
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("tags");
}
