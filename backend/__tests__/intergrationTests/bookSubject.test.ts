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
  const negativeTestCases: [number, number, number, string][] = [
      [-1, 1, 1, "Invalid subject ID. Subject ID must be a number greater than or equal to 1."],
      [NaN, 1, 1, "Invalid subject ID. Subject ID must be a number greater than or equal to 1."],
      [0, 1, 1, "Invalid subject ID. Subject ID must be a number greater than or equal to 1."],
      [1, -1, 1, "Invalid page number. Page must be a number greater than or equal to 1."],
      [1, NaN, 1, "Invalid page number. Page must be a number greater than or equal to 1."],
      [1, 0, 1, "Invalid page number. Page must be a number greater than or equal to 1."],
      [1, 1, -1, "Invalid limit. Limit must be a number greater than or equal to 1."],
      [1, 1, NaN, "Invalid limit. Limit must be a number greater than or equal to 1."],
      [1, 1, 101, "Invalid limit. Limit must be a number less than or equal to 100."],
      [1, 1, 0, "Invalid limit. Limit must be a number greater than or equal to 1."]
  ];

  test.each(negativeTestCases)(
    "should throw an error (subjectId: %i, page: %i, limit: %i, errorMessage: %s)",
    async (subjectId: number, page: number, limit: number, errorMessage: string) => {
      await expect(getBooksBySubject(subjectId, page, limit)).rejects.toThrow(errorMessage);
    }
  );
});
