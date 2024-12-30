import { afterAll, beforeAll, describe, expect, it, jest, test } from "@jest/globals";

jest.setTimeout(30000); // Sets timeout to 30 seconds

import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";
import knex from "knex";
import knexConfig from "../../knexfile";
import { getUserBooks, addBookToUser, removeBookFromUser } from "../../services/userBookService";

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
    ["test_email@example.com", 1],
    ["test_email@example.com", 2],
    ["test@test.com", 100],
    ["test@test.com", 99],
    ["test_password@example.com", 50],
  ];

  test.each(positiveTestCases)(
    "should add a book to a user (email: %s, bookId: %i)",
    async (...args: (string | number)[]) => {
      const [email, bookId] = args as [string, number];
      const userBook = await addBookToUser(email, Number(bookId));
      expect(userBook).toBeDefined();
      expect(userBook).toHaveProperty("id");
    }
  );
});

describe("addBookToUser function negative tests", () => {
  const negativeTestCases = [
    [-1, 1, "Invalid email. Email must be a string."],
    [NaN, 1, "Invalid email. Email must be a string."],
    [1, -1, "Invalid email. Email must be a string."],
    ["test_email@example.com", NaN, "Invalid book id. Book id must be a number greater than or equal to 1."],
    ["test_email@example.com", 5000, "Book not found"],
    ["wrong@email.com", 1, "User not found"],
  ];

  test.each(negativeTestCases)(
    "should throw an error (userId: %i, bookId: %i, errorMessage: %s)",
    async (...args: (string | number)[]) => {
      const [email, bookId, errorMessage] = args as [string, number, string];
      await expect(addBookToUser(email, Number(bookId))).rejects.toThrow(errorMessage);
    }
  );
});

describe("getUserBooks function positive tests", () => {
  const positiveTestCases = [
    ["test_email@example.com"],
    ["test_password@example.com"],
    ["test@test.com"],
    ["test_email@example.com", 1, 1],
    ["test_email@example.com", 1, 100],
    ["test_email@example.com", 1, 99],
    ["test_email@example.com", 1, 50],
  ];

  test.each(positiveTestCases)(
    "should fetch books for a user (userId: %i, page: %i, limit: %i)",
    async (...args: (string | number)[]) => {
      const [email, page, limit] = args as [string, number?, number?];
      const userBooks = await getUserBooks(email, page, limit);
      expect(userBooks).toBeDefined();

    }
  );
});

describe("getUserBooks function negative tests", () => {
  const negativeTestCases = [
    ["test_email@example.com", -1, 1, "Invalid page number. Page must be a number greater than or equal to 1."],
    ["test_email@example.com", NaN, 1, "Invalid page number. Page must be a number greater than or equal to 1."],
    ["test_email@example.com", 1, -1, "Invalid limit. Limit must be a number greater than or equal to 1."],
    ["test_email@example.com", 1, NaN, "Invalid limit. Limit must be a number greater than or equal to 1."],
    ["test_email@example.com", 1, 101, "Invalid limit. Limit must be a number less than or equal to 100."],
  ];

  test.each(negativeTestCases)(
    "should throw an error (userId: %i, page: %i, limit: %i, errorMessage: %s)",
    async (...args: (string | number)[]) => {
      const [email, page, limit, errorMessage] = args as [string, number, number, string];
      await expect(getUserBooks(email, page, limit)).rejects.toThrow(errorMessage);
    }
  );
});

describe("removeBookFromUser function positive tests", () => {
  const positiveTestCases = [
    ["test_email@example.com", 1],
  ];

  test.each(positiveTestCases)(
    "should remove a book from a user (email: %s, bookId: %i)",
    async (...args: (string | number)[]) => {
      const [email, bookId] = args as [string, number];

      const result = await removeBookFromUser(email, Number(bookId));

      expect(result).toBe(true);
    }
  );
});

describe("removeBookFromUser function negative tests", () => {
  const negativeTestCases = [
    [-1, 1, "Invalid email. Email must be a string."],
    [NaN, 1, "Invalid email. Email must be a string."],
    [1, -1, "Invalid email. Email must be a string."],
    ["test_email@example.com", NaN, "Invalid Book id. Book id must be a number greater than or equal to 1."],
    ["email_test@example.com", 1, "User not found"],
  ];

  test.each(negativeTestCases)(
    "should throw an error (userId: %i, bookId: %i, errorMessage: %s)",
    async (...args: (string | number)[]) => {
      const [email, bookId, errorMessage] = args as [string, number, string];
      await expect(removeBookFromUser(email, Number(bookId))).rejects.toThrow(errorMessage);
    }
  );
});