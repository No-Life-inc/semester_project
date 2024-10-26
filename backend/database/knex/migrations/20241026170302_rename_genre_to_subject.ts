import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.renameTable("genre", "subjects");
    await knex.schema.renameTable("book_genre", "book_subjects");
    await knex.schema.table("book_subjects", function(table) {
        table.dropForeign("genre_id", "book_genre_genre_id_foreign");
        table.renameColumn("genre_id", "subject_id");
        table.foreign("subject_id").references("subjects.id").onDelete("CASCADE");
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.renameTable("subjects", "genre");
    await knex.schema.renameTable("book_subjects", "book_genre");
    await knex.schema.table("book_genre", function(table) {
        table.dropForeign("subject_id", "book_subjects_subject_id_foreign");
        table.renameColumn("subject_id", "genre_id");
        table.foreign("genre_id").references("genre.id").onDelete("CASCADE");
    });
}