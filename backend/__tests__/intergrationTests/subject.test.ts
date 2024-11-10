import { afterAll, beforeAll, describe, expect, it, jest, test } from "@jest/globals";
import { setupTestDB, teardownTestDB } from "./setupTestDB";
import { getAllSubjects, getSubjectById } from "../../services/subjectService";

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
    [9999, "Subject not found"],
];

test.each(negativeTestCases)(
    "should throw an error (subjectId: %i, errorMessage: %s)",
    async (subjectId: number, errorMessage: string) => {
        await expect(getSubjectById(subjectId)).rejects.toThrow(errorMessage);
    }
);
});
