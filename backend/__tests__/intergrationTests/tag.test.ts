import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import { setupTestDB, teardownTestDB } from "./setupTestDB";
import knex from "knex";
import knexConfig from "../../knexfile";
import { getAllTags, getTagById, addTag, deleteTagById } from "../../services/tagService";

jest.setTimeout(30000);

const testKnex = knex(knexConfig.test);

beforeAll(async () => {
    await setupTestDB();
});

afterAll(async () => {
    await teardownTestDB();
});

// Tests for getAllTags
describe("getAllTags function tests", () => {
    const testCases = [
        [1, 10, 10],
        [1, 5, 5],
        [2, 10, 10],
        [1, 50, 50],
    ];

    test.each(testCases)("should fetch tags (page: %i, limit: %i)",
        async (page, limit, expectedLength) => {
            const tags = await getAllTags(page, limit);
            expect(tags?.length).toBeLessThanOrEqual(expectedLength);
        }
    );
});

describe("getTagById function tests", () => {
    const positiveTestCases = [1, 2, 3, 4, 5];

    test.each(positiveTestCases)(
        "should fetch a tag by valid id (tagId: %i)",
        async (tagId) => {
            const tag = await getTagById(tagId);
            expect(tag).toBeDefined();
            expect(tag.id).toBe(tagId);
        }
    );

    const negativeTestCases = [
        [0, "Invalid tag id. Tag id must be a number greater than or equal to 1."],
        [-1, "Invalid tag id. Tag id must be a number greater than or equal to 1."],
        [NaN, "Invalid tag id. Tag id must be a number greater than or equal to 1."],
        [5555, "Tag not found"],
    ];

    test.each(negativeTestCases)(
        "should throw an error for invalid id (tagId: %i, errorMessage: %s)",
        async (tagId, errorMessage) => {
            await expect(getTagById(Number(tagId))).rejects.toThrow(errorMessage);
        }
    );
});

describe("addTag function tests", () => {
    test("should create a new tag successfully", async () => {
        const tagName = "New Tag";
        const newTag = await addTag(tagName);
        expect(newTag).toBeDefined();
        expect(newTag.name).toBe(tagName);
    });

    test("should throw an error when creating a tag without a name", async () => {
        await expect(addTag("")).rejects.toThrow("Tag name is required");
    });
});


describe("deleteTagById function tests", () => {
    test("should delete a tag successfully", async () => {
        const tagName = "Temporary Tag";
        const tag = await addTag(tagName);
        const deletedCount = await deleteTagById(tag.id);
        expect(deletedCount).toBe(1);
    });

    test("should throw an error when deleting a non-existent tag", async () => {
        await expect(deleteTagById(9999)).rejects.toThrow("An error occurred while deleting tag");
    });
});
