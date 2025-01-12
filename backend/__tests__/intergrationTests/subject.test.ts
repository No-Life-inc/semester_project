import { afterAll, beforeAll, describe, expect, it, jest, test } from "@jest/globals";
import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";
import { getAllSubjects, getSubjectById } from "../../services/subjectService";
import { NotFoundError, ValidationError } from "../../utility/errors";
import Subject from "../../models/sequelize/Subject";

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
    const negativeTestCases: [number | null | undefined, number | null | undefined, string, typeof ValidationError][] = [
      [null, 1, "Invalid page number. Page must be a number greater than or equal to 1.", ValidationError],
      [undefined, 1, "Invalid page number. Page must be a number greater than or equal to 1.", ValidationError],
      [-1, 1, "Invalid page number. Page must be a number greater than or equal to 1.", ValidationError],
      [-2, 1, "Invalid page number. Page must be a number greater than or equal to 1.", ValidationError],
      [NaN, 1, "Invalid page number. Page must be a number greater than or equal to 1.", ValidationError],
      ["a" as any, 1, "Invalid page number. Page must be a number greater than or equal to 1.", ValidationError],
      [1, null, "Invalid limit. Limit must be a number greater than or equal to 1.", ValidationError],
      [1, undefined, "Invalid limit. Limit must be a number greater than or equal to 1.", ValidationError],
      [1, -1, "Invalid limit. Limit must be a number greater than or equal to 1.", ValidationError],
      [1, -2, "Invalid limit. Limit must be a number greater than or equal to 1.", ValidationError],
      [1, NaN, "Invalid limit. Limit must be a number greater than or equal to 1.", ValidationError],
      [1, 101, "Invalid limit. Limit must be a number less than or equal to 100.", ValidationError],
      [1, 102, "Invalid limit. Limit must be a number less than or equal to 100.", ValidationError],
      [1, 0, "Invalid limit. Limit must be a number greater than or equal to 1.", ValidationError],
      [1, "a" as any, "Invalid limit. Limit must be a number greater than or equal to 1.", ValidationError],
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
 
describe("Subject model field boundary positive tests", () => {
  const cases: [Partial<Subject>, keyof Subject, any, string][] = [
    [{ name: "A" }, "name", "A", "should accept minimal valid name (1 char)"],
    [{ name: "Valid Name" }, "name", "Valid Name", "should accept typical valid name"],
    [{ name: "A".repeat(255) }, "name", "A".repeat(255), "should accept maximal valid name (255 chars)"],
  ];

  test.each(cases)(
    "%s",
    async (fieldData, fieldToCheck, expectedValue, description) => {
      const subject = await Subject.create(fieldData);

      expect(subject).toBeDefined();
      expect(subject[fieldToCheck]).toEqual(expectedValue);

      expect(subject.id).toBeDefined();
      expect(subject.id).toBeGreaterThan(0);
      expect(subject.createdAt).toBeDefined();
      expect(subject.createdAt).toBeInstanceOf(Date);
    }
  );
});

describe("Subject model field boundary negative tests", () => {
  const cases: [Partial<Subject>, keyof Subject, string, string][] = [
    [{ name: "" }, "name", "Validation error: Validation notEmpty on name failed", "should reject empty name"],
    [{ name: " " }, "name", "Validation error: Validation notEmpty on name failed", "should reject whitespace-only name"],
    [{ name: "A".repeat(256) }, "name", "Validation error: Validation len on name failed", "should reject name exceeding 255 chars"],
  ];

  test.each(cases)(
    "%s",
    async (fieldData, fieldToCheck, expectedError, description) => {
      await expect(Subject.create(fieldData)).rejects.toThrow(expectedError);
    }
  );
});

