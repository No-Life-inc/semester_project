import { afterAll, beforeAll, describe, expect, it, jest, test } from "@jest/globals";
import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";
import { getAllSubjects, getSubjectById } from "../../services/subjectService";
import  Subject  from "../../models/sequelize/Subject";

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


describe("Subject field boundary positive tests", () => {
  const cases = [
    { name: "A", description: "should accept minimal valid name (1 char)" },
    { name: "Subject Name", description: "should accept typical valid name" },
    { name: "a".repeat(255), description: "should accept maximal valid name (255 chars)" },
  ];

  test.each(cases)(
    "$description",
    async ({ name }) => {
      const result = await Subject.create({ name });
      expect(result).toBeDefined();
      expect(result.name).toBe(name);
      expect(result.createdAt).toBeDefined();
    }
  );
});


describe("Subject field boundary negative tests", () => {
  const cases = [
    { name: "", errorMessage: "Validation error: name cannot be empty" },
    { name: null, errorMessage: "Validation error: name cannot be null" },
    { name: "a".repeat(256), errorMessage: "Validation error: name cannot exceed 255 characters" },
  ];

  test.each(cases)(
    "should throw an error when name is invalid: $name",
    async ({ name, errorMessage }) => {
      await expect(Subject.create({ name })).rejects.toThrow(errorMessage);
    }
  );
});


describe("Subject createdAt field positive tests", () => {
  const cases = [
    { createdAt: new Date("2023-01-01"), description: "should accept a valid date" },
    { createdAt: undefined, description: "should use default value for createdAt" },
  ];

  test.each(cases)(
    "$description",
    async ({ createdAt }) => {
      const subjectData = { name: "Test Subject", createdAt };
      const result = await Subject.create(subjectData);
      expect(result).toBeDefined();
      expect(result.createdAt).toBeDefined();
    }
  );
});


describe("Subject createdAt field negative tests", () => {
  const cases = [
    { createdAt: new Date("invalid-date"), errorMessage: "Validation error: invalid date" },
    { createdAt: new Date("9999-12-31T00:00:00Z"), errorMessage: "Validation error: date out of range" },
  ];

  test.each(cases)(
    "should throw an error when createdAt is invalid",
    async ({ createdAt, errorMessage }) => {
      const subjectData = { name: "Test Subject", createdAt };
      await expect(Subject.create(subjectData)).rejects.toThrow(errorMessage);
    }
  );
});
