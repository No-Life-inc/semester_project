import { afterAll, beforeAll, describe, expect, it, jest, test } from "@jest/globals";
import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";
import { getAllSubjects, getSubjectById } from "../../services/subjectService";
import SubjectAPIData from "../../types/subjectAPIData";
import Subject from "../../models/sequelize/Subject";

jest.setTimeout(30000);

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
    [1, 100, 100],
    [1, 99, 99],
    [1, 50, 50],
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
    [-1, 10, "Invalid page number. Page must be a number greater than or equal to 1."],
    [NaN, 10, "Invalid page number. Page must be a number greater than or equal to 1."],
    [1, -10, "Invalid limit. Limit must be a number greater than or equal to 1."],
    [1, NaN, "Invalid limit. Limit must be a number greater than or equal to 1."],
    [1, 101, "Invalid limit. Limit must be a number less than or equal to 100."],
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
    [99],
    [100],
    [50],
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
const negativeTestCases: [number, string][] = [
    [-1, "Invalid subject ID. Subject ID must be a number greater than or equal to 1."],
    [NaN, "Invalid subject ID. Subject ID must be a number greater than or equal to 1."],
    [5000, "Subject not found"],
    [0, "Invalid subject ID. Subject ID must be a number greater than or equal to 1."],
    ["1" as any, "Invalid subject ID. Subject ID must be a number greater than or equal to 1."],
];

test.each(negativeTestCases)(
    "should throw an error (subjectId: %i, errorMessage: %s)",
    async (subjectId: number, errorMessage: string) => {
        await expect(getSubjectById(subjectId)).rejects.toThrow(errorMessage);
    }
);
});

describe("Subject field boundary positive tests", () => {
  const maxText = "a".repeat(255); // Maximal name length for a STRING type
  const maxTextMinusOne = "a".repeat(254); // One less than maximal length
  const minimalNonEmptyText = "a"; // Smallest valid non-empty string

  const cases: [Partial<SubjectAPIData>, keyof Subject, any, string][] = [
    // Minimal cases
    [{ name: minimalNonEmptyText }, "name", minimalNonEmptyText, "should accept minimal non-empty name"],
    
    // Typical cases
    [{ name: "Default Subject" }, "name", "Default Subject", "should accept a typical name"],
    
    // Boundary cases
    [{ name: maxText }, "name", maxText, "should accept maximal name (255 chars)"],
    [{ name: maxTextMinusOne }, "name", maxTextMinusOne, "should accept name one character below the limit"],
  ];

  test.each(cases)(
    "%s",
    async (fieldData, fieldToCheck, expectedValue, description) => {
      // Prepare the subject object
      const validSubject: Partial<SubjectAPIData> = { ...fieldData };

      // Simulate Subject creation
      const createdSubject = await Subject.create(validSubject as SubjectAPIData);

      // Validate results
      expect(createdSubject).toBeDefined();
      expect(createdSubject[fieldToCheck]).toEqual(expectedValue);
      expect(createdSubject.id).toBeDefined();
      expect(createdSubject.createdAt).toBeDefined();
    }
  );
});


describe("Subject field boundary negative tests", () => {
  const overMaxText = "A".repeat(256); // Exceeds the 255-character limit
  const emptyText = ""; // Empty string
  const whitespaceText = " "; // Whitespace-only string
  const nullValue = null; // Null value
  const undefinedValue = undefined; // Undefined value

  const cases: [Partial<SubjectAPIData>, string, RegExp][] = [
    // Name field tests
    [{ name: overMaxText }, "should reject name exceeding 255 characters", /name|validation/i],
    [{ name: emptyText }, "should reject empty name", /name|required/i],
    [{ name: whitespaceText }, "should reject whitespace-only name", /name|required/i],
    [{ name: nullValue }, "should reject null name", /name|validation/i],
    [{ name: undefinedValue }, "should reject undefined name", /name|required/i],
  ];

  test.each(cases)(
    "%s",
    async (fieldData, description, expectedError) => {
      // Attempt to create a Subject with invalid data
      await expect(Subject.create(fieldData as SubjectAPIData)).rejects.toThrow(expectedError);
    }
  );
});

