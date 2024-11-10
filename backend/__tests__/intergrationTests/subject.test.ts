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
  
describe("getAllSubjects function", () => {
it("should fetch all subjects", async () => {
    const subjects = await getAllSubjects();
    expect(Array.isArray(subjects)).toBe(true);
    expect(subjects.length).toBeGreaterThanOrEqual(0);
});
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
