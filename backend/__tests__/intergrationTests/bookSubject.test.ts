import { afterAll, beforeAll, describe, expect, it, jest, test } from "@jest/globals";
import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";
import { getBooksBySubject } from "../../services/bookSubjectService";

jest.setTimeout(120000);

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

describe("getBooksBySubject function positive tests", () => {
  const positiveTestCases = [
    [1, 1, 1], 
    [1, 1, 2],
    [1, 1, 50],
    [1, 1, 99],
    [1, 1, 100],
    [2, 2, 1]
  ];

  test.each(positiveTestCases)(
    "should fetch books for a subject (subjectId: %i, page: %i, limit: %i)",
    async (subjectId, page, limit) => {
      const books = await getBooksBySubject(subjectId, page, limit);
      expect(Array.isArray(books)).toBe(true);
      expect(books.length).toBeLessThanOrEqual(limit);
    }
  );
});

describe("getBooksBySubject function negative tests", () => {
  const negativeTestCases: [number | null | undefined, number | null | undefined, number | null | undefined, string][] = [
    [undefined, 1, 1, "Invalid subject ID. Subject ID must be a number greater than or equal to 1."],
    [null, 1, 1, "Invalid subject ID. Subject ID must be a number greater than or equal to 1."],
    [-1, 1, 1, "Invalid subject ID. Subject ID must be a number greater than or equal to 1."],
    [-2, 1, 1, "Invalid subject ID. Subject ID must be a number greater than or equal to 1."],
    [185, 1, 1, "No books found for subject ID 185."],
    [186, 1, 1, "No books found for subject ID 186."],
    [NaN, 1, 1, "Invalid subject ID. Subject ID must be a number greater than or equal to 1."],
    [0, 1, 1, "Invalid subject ID. Subject ID must be a number greater than or equal to 1."],
    ["a" as any, 1, 1, "Invalid subject ID. Subject ID must be a number greater than or equal to 1."],
    [1, undefined, 1, "Invalid page number. Page must be a number greater than or equal to 1."],
    [1, null, 1, "Invalid page number. Page must be a number greater than or equal to 1."],
    [1, -1, 1, "Invalid page number. Page must be a number greater than or equal to 1."],
    [1, -2, 1, "Invalid page number. Page must be a number greater than or equal to 1."],
    [1, NaN, 1, "Invalid page number. Page must be a number greater than or equal to 1."],
    [1, 0, 1, "Invalid page number. Page must be a number greater than or equal to 1."],
    [1, "a" as any, 1, "Invalid page number. Page must be a number greater than or equal to 1."],
    [1, 1, undefined, "Invalid limit. Limit must be a number greater than or equal to 1."],
    [1, 1, null, "Invalid limit. Limit must be a number greater than or equal to 1."],
    [1, 1, -1, "Invalid limit. Limit must be a number greater than or equal to 1."],
    [1, 1, -2, "Invalid limit. Limit must be a number greater than or equal to 1."],
    [1, 1, NaN, "Invalid limit. Limit must be a number greater than or equal to 1."],
    [1, 1, 101, "Invalid limit. Limit must be a number less than or equal to 100."],
    [1, 1, 102, "Invalid limit. Limit must be a number less than or equal to 100."],
    [1, 1, 0, "Invalid limit. Limit must be a number greater than or equal to 1."],
    [1, 1, "a" as any, "Invalid limit. Limit must be a number greater than or equal to 1."],
  ];

  test.each(negativeTestCases)(
    "should throw an error (subjectId: %i, page: %i, limit: %i, errorMessage: %s)",
    async (subjectId, page, limit, errorMessage) => {
      await expect(getBooksBySubject(Number(subjectId), Number(page), Number(limit))).rejects.toThrow(errorMessage);
    }
  );
});
