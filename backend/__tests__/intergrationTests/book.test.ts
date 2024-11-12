import { afterAll, beforeAll, describe, expect, it, jest, test } from "@jest/globals";

jest.setTimeout(30000); // Sets timeout to 30 seconds

import { setupTestDB, teardownTestDB } from "./setupTestDB";
import knex from "knex";
import knexConfig from "../../knexfile";
import { getBooks, getBookById, addBooks, getBooksByTitle } from "../../services/bookService";
import BookData from "../../types/bookData";
import Publisher from "../../models/sequelize/Publisher";
import Subject from "../../models/sequelize/Subject";

// Initialize Knex
const testKnex = knex(knexConfig.test);

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

describe("getBooks function positive tests", () => {
  const positiveTestCases = [
    [1, 1, 1],
    [1, 2, 2],
    [1, 100, 100],
    [1, 99, 99],
    [1, 50, 50],
    [undefined, undefined, 50], // No parameters should fetch books with page 1, limit 50
  ];

  test.each(positiveTestCases)(
    "should fetch books (page: %i, limit: %i)",
    async (page, limit, expectedLength) => {
      const books = await getBooks(page, limit);
      expect(books?.length).toBeLessThanOrEqual(expectedLength ?? 0);
    }
  );
});

describe("getBooks function negative tests", () => {
  const negativeTestCases = [
    [-1, 10, "Invalid page number. Page must be a number greater than or equal to 1."],
    [NaN, 10, "Invalid page number. Page must be a number greater than or equal to 1."],
    [1, -10, "Invalid limit. Limit must be a number greater than or equal to 1."],
    [1, NaN, "Invalid limit. Limit must be a number greater than or equal to 1."],
    [1, 101, "Invalid limit. Limit must be a number less than or equal to 100."],
  ];

  test.each(negativeTestCases)(
    "should throw an error (page: %i, limit: %i, errorMessage: %s)",
    async (page, limit, errorMessage) => {
      await expect(getBooks(Number(page), Number(limit))).rejects.toThrow(errorMessage);
    }
  );
});

describe("getBookById function positive tests", () => {
  const positiveTestCases = [
    [1],
    [2],
    [99],
    [100],
    [50],
  ];

  test.each(positiveTestCases)(
    "should fetch a book by valid id (bookId: %i)",
    async (bookId) => {
      const book = await getBookById(bookId);
      expect(book).toBeDefined();
      expect(book.id).toBe(bookId);
    }
  );
});

describe("getBookById function negative tests", () => {
  const negativeTestCases: [number, string][] = [
    [-1, "Invalid book id. Book id must be a number greater than or equal to 1."],
    [NaN, "Invalid book id. Book id must be a number greater than or equal to 1."],
    [5000, "Book not found"],
  ];

  test.each(negativeTestCases)(
    "should throw an error (bookId: %i, errorMessage: %s)",
    async (bookId: number, errorMessage: string) => {
      await expect(getBookById(bookId)).rejects.toThrow(errorMessage);
    }
  );
});

describe("addBooks function positive tests", () => {
  const positiveTestCases: [BookData[], string, string][] = [
    [
      [
        {
          title: "Test Book 1",
          publisher: "Test Publisher",
          edition: "1st",
          isbn: "1234567890",
          language: "en",
          pages: 100,
          date_published: new Date().toDateString(),
          dimensions: "8x11",
          image: "http://example.com/image1.jpg",
          synopsis: "Test synopsis 1",
          msrp: 19.99,
          isbn10: "1234567890",
          isbn13: "123-1234567890",
          binding: "Hardcover",
          subjects: ["Test Subject 1"],
          authors: ["Test Author 1"],
        },
      ],
      "Test Publisher",
      "Test Subject 1",
    ],
    [
      [
        {
          title: "Test Book 2",
          publisher: "Another Publisher",
          edition: "2nd",
          isbn: "0987654321",
          language: "en",
          pages: 200,
          date_published: new Date().toDateString(),
          dimensions: "8x11",
          image: "http://example.com/image2.jpg",
          synopsis: "Test synopsis 2",
          msrp: 29.99,
          isbn10: "0987654321",
          isbn13: "123-0987654321",
          binding: "Paperback",
          subjects: ["Another Subject"],
          authors: ["Test Author 2"],
        },
      ],
      "Another Publisher",
      "Another Subject",
    ],
    [
      [
        {
          title: "Test Book 3",
          publisher: "Minimal Publisher",
          subjects: ["Minimal Subject"],
        },
      ],
      "Minimal Publisher",
      "Minimal Subject",
    ],
  ];

  test.each(positiveTestCases)(
    "should add books (booksData: %o) and check for publisher and subject",
    async (booksData, expectedPublisher, expectedSubject) => {
      // Perform the insertion
      const addedBooks = await addBooks(booksData);
      expect(addedBooks).toBeDefined();
      expect(addedBooks.length).toBe(booksData.length);

      // Verify each book was added with correct title
      for (let i = 0; i < booksData.length; i++) {
        expect(addedBooks[i].title).toBe(booksData[i].title);
      }

      // Check that the publisher exists in the database
      const publisher = await Publisher.findOne({ where: { name: expectedPublisher } });
      expect(publisher).toBeDefined();
      expect(publisher.name).toBe(expectedPublisher);

      // Check that the subject exists in the database
      const subject = await Subject.findOne({ where: { name: expectedSubject } });
      expect(subject).toBeDefined();
      expect(subject.name).toBe(expectedSubject);
    }
  );
});



describe("addBooks function negative tests", () => {
  const negativeTestCases: [Partial<BookData>[], string][] = [
    [
      [
        {
          publisher: "Test Publisher", // Title omitted to trigger validation error
          edition: "1st",
          isbn: "1234567890",
          language: "en",
          pages: 100,
          date_published: new Date().toDateString(),
          dimensions: "8x11",
          image: "http://example.com/image2.jpg",
          synopsis: "Test synopsis 2",
          msrp: 29.99,
          isbn10: "0987654321",
          isbn13: "123-0987654321",
          binding: "Paperback",
          subjects: ["Test Subject 2"],
          authors: ["Test Author 2"],
        },
      ],
      "notNull Violation: Book.title cannot be null",
    ],
  ];

  test.each(negativeTestCases)(
    "should throw an error (booksData: %o, errorMessage: %s)",
    async (booksData, errorMessage) => {
      await expect(addBooks(booksData as BookData[])).rejects.toThrow(errorMessage);
    }
  );
});

describe("getBooksByTitle function", () => {
  const positiveTestCases = [
    ["Scrooge", "Scrooge"],
    ["The Sentinel: A Jack Reacher Novel", "The Sentinel: A Jack Reacher Novel"],
  ];

  test.each(positiveTestCases)(
    "should return expected books when searching for title '%s'",
    async (searchTitle: string, expectedTitleSubstring: string) => {
      const books = await getBooksByTitle(searchTitle);
      
        expect(books).toBeDefined();
        expect(books.length).toBeGreaterThan(0);
        expect(books[0].title).toContain(expectedTitleSubstring);
  
    }
  );

  const negativeTestCases: [string | null, string][] = [
    ["", "Invalid title. Title must be a non-empty string."],
    [null, "Invalid title. Title must be a non-empty string."],
  ];

  test.each(negativeTestCases)(
    "should throw an error for invalid title '%s'",
    async (invalidTitle, expectedErrorMessage) => {
      await expect(getBooksByTitle(invalidTitle as any)).rejects.toThrow(expectedErrorMessage);
    }
  );
});
