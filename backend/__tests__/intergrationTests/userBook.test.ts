import { afterAll, beforeAll, describe, expect, it, jest, test } from "@jest/globals";

jest.setTimeout(30000); // Sets timeout to 30 seconds

import { setupTestDB, teardownTestDB } from "./setupTestDB";
import knex from "knex";
import knexConfig from "../../knexfile";
import { getUserBooks, addBookToUser } from "../../services/userBookService";

// Initialize Knex
const testKnex = knex(knexConfig.test);

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

describe("addBookToUser function positive tests", () => {
  const positiveTestCases = [
    [1, 1],
    [1, 2],
    [3, 100],
    [3, 99],
    [2, 50],
  ];

  test.each(positiveTestCases)(
    "should add a book to a user (userId: %i, bookId: %i)",
    async (userId, bookId) => {
      const userBook = await addBookToUser(userId, bookId);
      expect(userBook).toBeDefined();
    }
  );
});

describe("addBookToUser function negative tests", () => {
  const negativeTestCases = [
    [-1, 1, "Invalid user id. User id must be a number greater than or equal to 1."],
    [NaN, 1, "Invalid user id. User id must be a number greater than or equal to 1."],
    [1, -1, "Invalid book id. Book id must be a number greater than or equal to 1."],
    [1, NaN, "Invalid book id. Book id must be a number greater than or equal to 1."],
    [1, 5000, "Book not found"],
    [5000, 1, "User not found"],
  ];

  test.each(negativeTestCases)(
    "should throw an error (userId: %i, bookId: %i, errorMessage: %s)",
    async (userId, bookId, errorMessage) => {
      await expect(addBookToUser(userId, bookId)).rejects.toThrow(errorMessage);
    }
  );
});

describe("getUserBooks function positive tests", () => {
  const positiveTestCases = [
    [1],
    [2],
    [3],
    [1, 1, 1],
    [1, 1, 100],
    [1, 1, 99],
    [1, 1, 50],
    [5000, 1, 50],
  ];

  test.each(positiveTestCases)(
    "should fetch books for a user (userId: %i, page: %i, limit: %i)",
    async (userId, page = 1, limit = 50) => {
      const userBooks = await getUserBooks(userId, page, limit);
      if (userId === 5000) {
        expect(userBooks.length).toBe(0);
      } else {
        expect(userBooks.length).toBeGreaterThan(0);
      }
    }
  );
});

describe("getUserBooks function negative tests", () => {
  const negativeTestCases = [
    [-1, 1, 1, "Invalid user id. User id must be a number greater than or equal to 1."],
    [NaN, 1, 1, "Invalid user id. User id must be a number greater than or equal to 1."],
    [1, -1, 1, "Invalid page number. Page must be a number greater than or equal to 1."],
    [1, NaN, 1, "Invalid page number. Page must be a number greater than or equal to 1."],
    [1, 1, -1, "Invalid limit. Limit must be a number greater than or equal to 1."],
    [1, 1, NaN, "Invalid limit. Limit must be a number greater than or equal to 1."],
    [1, 1, 101, "Invalid limit. Limit must be a number less than or equal to 100."],
  ];

  test.each(negativeTestCases)(
    "should throw an error (userId: %i, page: %i, limit: %i, errorMessage: %s)",
    async (userId: number, page: number, limit:number, errorMessage: string) => {
      await expect(getUserBooks(userId, page, limit)).rejects.toThrow(errorMessage);
    }
  );
});