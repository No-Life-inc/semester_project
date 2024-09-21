import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex('books').del();

    // Inserts seed entries
    await knex('books').insert([
        { title: '1984', author: 'George Orwell', year: 1949 },
        { title: 'Brave New World', author: 'Aldous Huxley', year: 1932 },
        { title: 'Fahrenheit 451', author: 'Ray Bradbury', year: 1953 },
    ]);
}
