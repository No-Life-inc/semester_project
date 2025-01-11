import type { Knex } from "knex";
import * as fs from "fs";
import * as path from "path";

const jsonFilePath = path.join("database", "dump", "books.json");

const booksData = JSON.parse(fs.readFileSync(jsonFilePath, "utf-8"));

const limitedBooksData = booksData.books.slice(0, 100);

export async function seed(knex: Knex): Promise<void> {
    
    await knex("book_subjects").del();
    await knex("book_authors").del();
    await knex("subjects").del();
    await knex("authors").del();
    await knex("books").del();


    for (const book of limitedBooksData) {
        let publisherId = null;

        if (book.publisher) {
            const existingPublisher = await knex("publishers").where({ name: book.publisher }).first();
            if (existingPublisher) {
                publisherId = existingPublisher.id;
            } else {
                const insertedPublisher = await knex("publishers").insert({ name: book.publisher }).returning("id");
                publisherId = insertedPublisher[0].id || insertedPublisher[0]; 
            }
        }

   
        const insertedBook = await knex("books").insert({
            title: book.title,
            image: book.image || null,
            title_long: book.title_long || null,
            publication_date: book.date_published ? new Date(book.date_published) : null, 
            publisher_id: publisherId,
            isbn13: book.isbn13 || null,
            binding: book.binding || null,
            isbn: book.isbn || null,
            isbn10: book.isbn10 || null,
            language: book.language || null,
            pages: book.pages || null,
            synopsis: book.synopsis || null,
            msrp: book.msrp || null,
            edition: parseInt(book.edition, 10) || null, 
            dimensions: book.dimensions || null
        }).returning("id");
        const bookId = insertedBook[0].id || insertedBook[0]; 

        
        for (const authorName of book.authors) {
            let authorId;
            const existingAuthor = await knex("authors").where({ name: authorName }).first();
            if (existingAuthor) {
                authorId = existingAuthor.id;
            } else {
                const insertedAuthor = await knex("authors").insert({ name: authorName }).returning("id");
                authorId = insertedAuthor[0].id || insertedAuthor[0]; 
            }
            await knex("book_authors").insert({ book_id: bookId, author_id: authorId });
        }

        
        if (Array.isArray(book.subjects)) {
            for (const subjectName of book.subjects) {
                let subjectId;
                const existingSubject = await knex("subjects").where({ name: subjectName }).first();
                if (existingSubject) {
                    subjectId = existingSubject.id;
                } else {
                    const insertedSubject = await knex("subjects").insert({ name: subjectName }).returning("id");
                    subjectId = insertedSubject[0].id || insertedSubject[0]; 
                }
                await knex("book_subjects").insert({ book_id: bookId, subject_id: subjectId });
            }
        }
    }
}