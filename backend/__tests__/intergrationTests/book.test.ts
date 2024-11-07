import { afterAll, beforeAll, describe, expect, it, jest, test } from "@jest/globals";

jest.setTimeout(30000); // Sets timeout to 30 seconds

import { setupTestDB, teardownTestDB } from "./setupTestDB";
import knex from "knex";
import knexConfig from "../../knexfile";
import { getBooks, getBookById } from "../../services/bookService";

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