import { getBooks } from "../../services/bookService";

let bookIds: number[] = [];

export const bookSetup = async () => {
    const books = await getBooks(1,50);
    books.forEach((book) => {
        bookIds.push(book.id);
    });
    console.log(bookIds);
}

export const getBookId = (index: number) => {
    return bookIds[index];
  };

export const teardownBookSetup = async () => {
    bookIds.splice(0, bookIds.length);
}