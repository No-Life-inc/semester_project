import { afterAll, beforeAll, describe, expect, it, jest, test } from "@jest/globals";
import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";
import { getBooksBySubject } from "../../services/bookSubjectService";
import BookSubject from "../../models/sequelize/BookSubject";

jest.setTimeout(30000);

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

describe("getBooksBySubject function positive tests", () => {
  const positiveTestCases = [
    [1, 1, 10], 
    [1, 1, 50],
    [1, 1, 100],
    [1, 2, 10],
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
      [1, -1, 1, "Invalid page number. Page must be a number greater than or equal to 1."],
      [1, NaN, 1, "Invalid page number. Page must be a number greater than or equal to 1."],
      [1, 1, -1, "Invalid limit. Limit must be a number greater than or equal to 1."],
      [1, 1, NaN, "Invalid limit. Limit must be a number greater than or equal to 1."],
      [1, 1, 101, "Invalid limit. Limit must be a number less than or equal to 100."],
  ];

  test.each(negativeTestCases)(
    "should throw an error (subjectId: %i, page: %i, limit: %i, errorMessage: %s)",
    async (subjectId: number, page: number, limit: number, errorMessage: string) => {
      await expect(getBooksBySubject(subjectId, page, limit)).rejects.toThrow(errorMessage);
    }
  );
});


describe("BookSubject Positive Boundary Test Cases", () => {
  const cases: [Partial<BookSubjectAPIData>, string][] = [
    // Minimal valid IDs
    [{ bookId: 1, subjectId: 1 }, "should accept minimal valid bookId and subjectId"],
    // Large valid IDs (within INT range)
    [{ bookId: 2147483647, subjectId: 2147483647 }, "should accept maximal valid bookId and subjectId"],
    // Typical IDs
    [{ bookId: 100, subjectId: 50 }, "should accept typical valid bookId and subjectId"],
  ];

  test.each(cases)("%s", async (fieldData, description) => {
    const createdRecord = await BookSubject.create(fieldData as BookSubjectAPIData);

    // Validate the created record
    expect(createdRecord).toBeDefined();
    expect(createdRecord.bookId).toEqual(fieldData.bookId);
    expect(createdRecord.subjectId).toEqual(fieldData.subjectId);
    expect(createdRecord.id).toBeDefined();
    expect(createdRecord.createdAt).toBeDefined();
  });
});


describe("BookSubject Negative Boundary Test Cases", () => {
  const cases: [Partial<BookSubjectAPIData>, string, RegExp][] = [
    // Null values
    [{ bookId: null, subjectId: 1 }, "should reject null bookId", /book_id|validation/i],
    [{ bookId: 1, subjectId: null }, "should reject null subjectId", /subject_id|validation/i],

    // Undefined values
    [{ bookId: undefined, subjectId: 1 }, "should reject undefined bookId", /book_id|validation/i],
    [{ bookId: 1, subjectId: undefined }, "should reject undefined subjectId", /subject_id|validation/i],

    // Negative values
    [{ bookId: -1, subjectId: 1 }, "should reject negative bookId", /book_id|validation/i],
    [{ bookId: 1, subjectId: -1 }, "should reject negative subjectId", /subject_id|validation/i],

    // Non-integer values
    [{ bookId: 1.5, subjectId: 1 }, "should reject non-integer bookId", /book_id|validation/i],
    [{ bookId: 1, subjectId: 2.5 }, "should reject non-integer subjectId", /subject_id|validation/i],

    // Exceeding max range
    [{ bookId: 2147483648, subjectId: 1 }, "should reject bookId exceeding INT_MAX", /book_id|validation/i],
    [{ bookId: 1, subjectId: 2147483648 }, "should reject subjectId exceeding INT_MAX", /subject_id|validation/i],

    // Missing foreign keys
    [{ bookId: 9999, subjectId: 1 }, "should reject bookId not referencing an existing book", /foreign key/i],
    [{ bookId: 1, subjectId: 9999 }, "should reject subjectId not referencing an existing subject", /foreign key/i],
  ];

  test.each(cases)("%s", async (fieldData, description, expectedError) => {
    // Attempt to create a BookSubject with invalid data
    await expect(BookSubject.create(fieldData as BookSubjectAPIData)).rejects.toThrow(expectedError);
  });
});
