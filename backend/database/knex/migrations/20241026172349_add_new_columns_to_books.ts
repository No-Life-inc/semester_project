import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("books", (table) => {
        table.string("image");
        table.string("title_long");
        table.string("synopsis", 1000);
        table.decimal("msrp", 10, 2);
        table.string("dimensions");
        table.renameColumn("page_num", "pages");
        table.integer("edition").alter();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("books", (table) => {
        table.dropColumn("image");
        table.dropColumn("title_long");
        table.dropColumn("synopsis");
        table.dropColumn("msrp");
        table.dropColumn("dimensions");
        table.renameColumn("pages", "page_num");
        table.string("edition").alter();
    });
}