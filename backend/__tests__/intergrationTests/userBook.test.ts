import { afterAll, beforeAll, describe, expect, it, jest, test } from "@jest/globals";

jest.setTimeout(120000);

import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";
import { getUserBooks, addBookToUser, removeBookFromUser, getUserBookById } from "../../services/userBookService";
import { NotFoundError, ValidationError, UnauthorizedError } from "../../utility/errors";

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
    [-1, 1, "Invalid email. Email must be a string.", ValidationError],
    [-2, 1, "Invalid email. Email must be a string.", ValidationError],
    [NaN, 1, "Invalid email. Email must be a string.", ValidationError],
    [null, 1, "Invalid email. Email must be a string.", ValidationError],
    [undefined, 1, "Invalid email. Email must be a string.", ValidationError],
    [1, -1, "Invalid email. Email must be a string.", ValidationError],
    ["test_email@example.com", NaN, "Invalid book id. Book id must be a number greater than or equal to 1.", ValidationError],
    ["test_email@example.com", 0, "Invalid book id. Book id must be a number greater than or equal to 1.", ValidationError],
    ["test_email@example.com", -1, "Invalid book id. Book id must be a number greater than or equal to 1.", ValidationError],
    ["test_email@example.com", -2, "Invalid book id. Book id must be a number greater than or equal to 1.", ValidationError],
    ["test_email@example.com", 101, "Book not found", NotFoundError],
    ["test_email@example.com", 102, "Book not found", NotFoundError],
    ["test_email@example.com", 5000, "Book not found", NotFoundError],
    ["wrong@email.com", 1, "User not found", ValidationError],
  ];

  test.each(negativeTestCases)(
    "should throw an error (userId: %i, bookId: %i, errorMessage: %s)",
    async (...args: (string | number | typeof ValidationError | NotFoundError | null | undefined)[]) => {
      const [email, bookId, errorMessage, err] = args as [string, number, string, typeof ValidationError | NotFoundError];
      await expect(addBookToUser(email, Number(bookId))).rejects.toThrow(err);
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
    ["test_email@example.com", 1, 2],
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
    ["test_email@example.com", -1, 1, "Invalid page number. Page must be a number greater than or equal to 1.", ValidationError],
    ["test_email@example.com", -2, 1, "Invalid page number. Page must be a number greater than or equal to 1.", ValidationError],
    ["test_email@example.com", 0, 1, "Invalid page number. Page must be a number greater than or equal to 1.", ValidationError],
    ["test_email@example.com", NaN, 1, "Invalid page number. Page must be a number greater than or equal to 1.", ValidationError],
    ["test_email@example.com", 1, -1, "Invalid limit. Limit must be a number greater than or equal to 1.", ValidationError],
    ["test_email@example.com", 1, NaN, "Invalid limit. Limit must be a number greater than or equal to 1.", ValidationError],
    ["test_email@example.com", 1, 101, "Invalid limit. Limit must be a number less than or equal to 100.", ValidationError],
    ["test_email@example.com", 1, 0, "Invalid limit. Limit must be a number greater than or equal to 1.", ValidationError],
  ];

  test.each(negativeTestCases)(
    "should throw an error (userId: %i, page: %i, limit: %i, errorMessage: %s)",
    async (...args: (string | number | typeof ValidationError)[]) => {
      const [email, page, limit, errorMessage, err] = args as [string, number, number, string, typeof ValidationError];
      await expect(getUserBooks(email, page, limit)).rejects.toThrow(err);
      await expect(getUserBooks(email, page, limit)).rejects.toThrow(errorMessage);
    }
  );
});

describe("getUserBookById function positive tests", () => {
  const positiveTestCases = [
    [1],
    [2],
    [3],
  ];

  test.each(positiveTestCases)(
    "should fetch a user book by ID (id: %i)",
    async (...args: (number)[]) => {
      const [id] = args as [number];
      const userBook = await getUserBookById(id);
      expect(userBook).toBeDefined();
      expect(userBook).toHaveProperty("id");
    }
  );
});

describe("getUserBookById function negative tests", () => {
  const negativeTestCases = [
    [-1, "Invalid Book id. Book id must be a number greater than or equal to 1.", ValidationError],
    [-2, "Invalid Book id. Book id must be a number greater than or equal to 1.", ValidationError],
    [NaN, "Invalid Book id. Book id must be a number greater than or equal to 1.", ValidationError],
    [0, "Invalid Book id. Book id must be a number greater than or equal to 1.", ValidationError],
    [null, "Invalid Book id. Book id must be a number greater than or equal to 1.", ValidationError],
    [undefined, "Invalid Book id. Book id must be a number greater than or equal to 1.", ValidationError],
    [101, "UserBook not found", NotFoundError],
    [102, "UserBook not found", NotFoundError],
    [5000, "UserBook not found", NotFoundError],
  ];

  test.each(negativeTestCases)(
    "should throw an error (userId: %i, errorMessage: %s)",
    async (...args: (number | string | typeof ValidationError | NotFoundError | null | undefined)[]) => {
      const [id, errorMessage, err] = args as [number, string, typeof ValidationError | NotFoundError];
      await expect(getUserBookById(id)).rejects.toThrow(err);
      await expect(getUserBookById(id)).rejects.toThrow(errorMessage);
    });
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
    [-1, 1, "Invalid email. Email must be a string.", ValidationError],
    [NaN, 1, "Invalid email. Email must be a string.", ValidationError],
    [null, 1, "Invalid email. Email must be a string.", ValidationError],
    [undefined, 1, "Invalid email. Email must be a string.", ValidationError],
    [1, -1, "Invalid email. Email must be a string.", ValidationError],
    ["test_email@example.com", NaN, "Invalid Book id. Book id must be a number greater than or equal to 1.", ValidationError],
    ["test_email@example.com", 0, "Invalid Book id. Book id must be a number greater than or equal to 1.", ValidationError],
    ["email_test@example.com", 1, "User not found", ValidationError],
    ["test_email@example.com", -1, "Invalid Book id. Book id must be a number greater than or equal to 1.", ValidationError],
    ["test_email@example.com", -2, "Invalid Book id. Book id must be a number greater than or equal to 1.", ValidationError],
    ["test_email@example.com", 101, "UserBook not found", NotFoundError],
    ["test_email@example.com", 102, "UserBook not found", NotFoundError],
  ];

  test.each(negativeTestCases)(
    "should throw an error (userId: %i, bookId: %i, errorMessage: %s)",
    async (...args: (string | number | typeof ValidationError | NotFoundError | UnauthorizedError | null | undefined)[]) => {
      const [email, bookId, errorMessage, err] = args as [string, number, string, typeof ValidationError | NotFoundError | UnauthorizedError];
      await expect(removeBookFromUser(email, Number(bookId))).rejects.toThrow(errorMessage);
      await expect(removeBookFromUser(email, Number(bookId))).rejects.toThrow(err);
    }
  );
});

