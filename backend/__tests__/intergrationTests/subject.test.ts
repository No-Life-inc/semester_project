import { afterAll, beforeAll, describe, expect, it, jest, test } from "@jest/globals";
import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";
import { getAllSubjects, getSubjectById } from "../../services/subjectService";
import { NotFoundError, ValidationError } from "../../utility/errors";

jest.setTimeout(120000);

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});
  
describe("getAllSubjects function positive tests", () => {
const positiveTestCases = [
    [1, 1, 1],
    [1, 2, 2],
    [1, 50, 50],
    [1, 99, 99],
    [1, 100, 100],
    [undefined, undefined, 50],
    [2, 1, 1]
];

test.each(positiveTestCases)(
    "should fetch subjects (page: %i, limit: %i)",
    async (page, limit, expectedLength) => {
      const subjects = await getAllSubjects(page, limit);
      expect(subjects?.length).toBeLessThanOrEqual(expectedLength ?? 0);
    }
  );
});

describe("getAllSubjects function negative tests", () => {
    const negativeTestCases = [
      [-1, 10, "Invalid page number. Page must be a number greater than or equal to 1.", ValidationError],
      [NaN, 10, "Invalid page number. Page must be a number greater than or equal to 1.", ValidationError],
      [1, -10, "Invalid limit. Limit must be a number greater than or equal to 1.", ValidationError],
      [1, NaN, "Invalid limit. Limit must be a number greater than or equal to 1.", ValidationError],
      [1, 101, "Invalid limit. Limit must be a number less than or equal to 100.", ValidationError],
      [1, 0, "Invalid limit. Limit must be a number greater than or equal to 1.", ValidationError],
    ];
  
    test.each(negativeTestCases)(
      "should throw an error (page: %i, limit: %i, errorMessage: %s)",
      async (page, limit, errorMessage) => {
        await expect(getAllSubjects(Number(page), Number(limit))).rejects.toThrow(errorMessage);
      }
    );
  });

describe("getSubjectById function positive tests", () => {
const positiveTestCases = [
    [1],
    [2],
    [50],
    [99],
    [100],
];

test.each(positiveTestCases)(
    "should fetch a subject by valid id (subjectId: %i)",
    async (subjectId) => {
    const subject = await getSubjectById(subjectId);
    expect(subject).toBeDefined();
    expect(subject.id).toBe(subjectId);
    }
);
});

describe("getSubjectById function negative tests", () => {
const negativeTestCases = [
    [-1, "Invalid subject ID. Subject ID must be a number greater than or equal to 1.", ValidationError],
    [-2, "Invalid subject ID. Subject ID must be a number greater than or equal to 1.", ValidationError],
    [NaN, "Invalid subject ID. Subject ID must be a number greater than or equal to 1.", ValidationError],
    [null, "Invalid subject ID. Subject ID must be a number greater than or equal to 1.", ValidationError],
    [undefined, "Invalid subject ID. Subject ID must be a number greater than or equal to 1.", ValidationError],
    [5000, "Subject not found", NotFoundError],
    [0, "Invalid subject ID. Subject ID must be a number greater than or equal to 1.", ValidationError],
    ["1" as any, "Invalid subject ID. Subject ID must be a number greater than or equal to 1.", ValidationError],
];

test.each(negativeTestCases)(
    "should throw an error (subjectId: %i, errorMessage: %s)",
    async (subjectId: any, errorMessage: string, err: ValidationError | NotFoundError) => {
        await expect(getSubjectById(subjectId)).rejects.toThrow(errorMessage);
              await expect(getSubjectById(subjectId)).rejects.toThrow(err);
        
    }
);
});
 

//TODO: boundary tests

