jest.setTimeout(30000); // Sets timeout to 30 seconds

import { setupTestDB, teardownTestDB } from "./setupTestDB";
import knex from "knex";
import knexConfig from "../../knexfile";
import {getBooks, getBookById} from "../../controllers/bookController";


// Initialize Knex
const testKnex = knex(knexConfig.test);

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

describe("getAllBooks function positive tests", () => {
    it("should fetch books with page 1, limit 1", async () => {
      const books = await getBooks(1, 1);
      expect(books.length).toBe(1);
    });
  
    it("should fetch books with page 1, limit 2", async () => {
      const books = await getBooks(1, 2);
      expect(books.length).toBe(2);
    });
  
    it("should fetch books with page 1, limit 100", async () => {
      const books = await getBooks(1, 100);
      expect(books.length).toBeLessThanOrEqual(100);
    });
  
    it("should fetch books with page 1, limit 99", async () => {
      const books = await getBooks(1, 99);
      expect(books.length).toBeLessThanOrEqual(99);
    });
  
    it("should fetch books with page 1, limit 50", async () => {
      const books = await getBooks(1, 50);
      expect(books.length).toBeLessThanOrEqual(50);
    });

    it("no parameters should fetch books with page 1, limit 50", async () => {
        const books = await getBooks();
        expect(books.length).toBeLessThanOrEqual(50);
      });
  });

describe("getBooks function negative tests", () => {
it("should throw an error for negative page number", async () => {
    await expect(getBooks(-1, 10)).rejects.toThrow("Invalid page number. Page must be a number greater than or equal to 1.");
});

it("should throw an error for non-numeric page number", async () => {
    await expect(getBooks(NaN, 10)).rejects.toThrow("Invalid page number. Page must be a number greater than or equal to 1.");
});

it("should throw an error for negative limit", async () => {
    await expect(getBooks(1, -10)).rejects.toThrow("Invalid limit. Limit must be a number greater than or equal to 1.");
});

it("should throw an error for non-numeric limit", async () => {
    await expect(getBooks(1, NaN)).rejects.toThrow("Invalid limit. Limit must be a number greater than or equal to 1.");
});

it("should throw an error for limit greater than 100", async () => {
    await expect(getBooks(1, 101)).rejects.toThrow("Invalid limit. Limit must be a number less than or equal to 100.");
});
});

describe("getBookById function positive tests", () => {
    it("should fetch a book by valid id", async () => {
      const book = await getBookById(1);
      expect(book).toBeDefined();
      expect(book.id).toBe(1);
    });
    it("should fetch a book by valid id", async () => {
        const book = await getBookById(2);
        expect(book).toBeDefined();
        expect(book.id).toBe(2);
      });
      it("should fetch a book by valid id", async () => {
        const book = await getBookById(99);
        expect(book).toBeDefined();
        expect(book.id).toBe(99);
      });
      it("should fetch a book by valid id", async () => {
        const book = await getBookById(100);
        expect(book).toBeDefined();
        expect(book.id).toBe(100);
      });
      it("should fetch a book by valid id", async () => {
        const book = await getBookById(50);
        expect(book).toBeDefined();
        expect(book.id).toBe(50);
      });  
    });

describe("getBookById function negative tests", () => {
it("should throw an error for negative book id", async () => {
    await expect(getBookById(-1)).rejects.toThrow("Invalid book id. Book id must be a number greater than or equal to 1.");
}
);

it("should throw an error for non-numeric book id", async () => {
    await expect(getBookById(NaN)).rejects.toThrow("Invalid book id. Book id must be a number greater than or equal to 1.");
}); 

it("should throw an error for non-existent book id", async () => {
    await expect(getBookById(5000)).rejects.toThrow("Book not found");
});
});
