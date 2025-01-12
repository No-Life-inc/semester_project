import { afterAll, beforeAll, describe, expect, jest, test } from "@jest/globals";
import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";
import { getAllTags, getTagById, addTag, deleteTagById } from "../../services/tagService";
import {
    BadRequestError,
    NotFoundError,
    ConflictError,
    ValidationError
} from "../../utility/errors";

jest.setTimeout(120000);

beforeAll(async () => {
    await setupTestDB();
});

afterAll(async () => {
    await teardownTestDB();
});

describe("getAllTags - Positive Tests", () => {
    const positiveCases = [
        [1, 1, 1], [1, 5, 5], [2, 10, 10], [1, 50, 50], [1, 100, 100]
    ];


    test.each(positiveCases)("should fetch tags (page: %i, limit: %i)", async (page, limit, expectedLength) => {
        const tags = await getAllTags(page, limit);
        expect(tags?.length).toBeLessThanOrEqual(expectedLength);
    });
});

describe("getAllTags - Negative Tests", () => {
    const negativeCases: [number | string | null | undefined, number | string | null | undefined, Error][] = [
        [0, 10, new BadRequestError("Page must be a positive number greater than 0.")],
        [-1, 10, new BadRequestError("Page must be a positive number greater than 0.")],
        [-2, 10, new BadRequestError("Page must be a positive number greater than 0.")],
        ["invalid", 10, new BadRequestError("Page must be a positive number greater than 0.")],
        [null, 10, new BadRequestError("Page must be a positive number greater than 0.")],
        [undefined, 10, new BadRequestError("Page must be a positive number greater than 0.")],
        [1000, 10, new BadRequestError("Page 1000 exceeds the maximum page number 6.")],
        [7, 10, new BadRequestError("Page 7 exceeds the maximum page number 6.")],
        [8, 10, new BadRequestError("Page 8 exceeds the maximum page number 6.")],
        [NaN, 10, new BadRequestError("Page must be a positive number greater than 0.")],
        [1, 0, new BadRequestError("Limit must be a positive number greater than 0.")],
        [1, -1, new BadRequestError("Limit must be a positive number greater than 0.")],
        [1, -2, new BadRequestError("Limit must be a positive number greater than 0.")],
        [1, 101, new BadRequestError("Limit must be a positive number less than or equal to 100.")],
        [1, 102, new BadRequestError("Limit must be a positive number less than or equal to 100.")],
        [1, "invalid", new BadRequestError("Limit must be a positive number greater than 0.")],
        [1, 1000, new BadRequestError("Limit must be a positive number less than or equal to 100.")],
        [1, NaN, new BadRequestError("Limit must be a positive number greater than 0.")],
        [1, null, new BadRequestError("Limit must be a positive number greater than 0.")],
        [1, undefined, new BadRequestError("Limit must be a positive number greater than 0.")],
    ];

    test.each(negativeCases)("should throw an error for invalid page or limit (page: %s, limit: %i)", async (page, limit, expectedError) => {
        await expect(getAllTags(Number(page), Number(limit))).rejects.toThrow(expectedError.constructor);
        await expect(getAllTags(Number(page), Number(limit))).rejects.toThrow(expectedError.message);
    });
});

describe("getTagById - Positive Tests", () => {
    const positiveCases: number[] = [1, 2, 25, 58, 59];

    test.each(positiveCases)("should fetch a tag by valid id (tagId: %i)", async (tagId) => {
        const tag = await getTagById(tagId);
        expect(tag).toBeDefined();
        expect(tag.id).toBe(tagId);
    });
});

describe("getTagById - Negative Tests", () => {
    const negativeCases: [number | string | null | undefined, Error][] = [
        [0, new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        [-1, new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        [-2, new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        [NaN, new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        [null, new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        [undefined, new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        ["invalid", new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        [9999, new NotFoundError("Tag not found")]
    ];

    test.each(negativeCases)("should throw an error for invalid id (tagId: %s)", async (tagId, expectedError) => {
        await expect(getTagById(Number(tagId))).rejects.toThrow(expectedError.constructor);
        await expect(getTagById(Number(tagId))).rejects.toThrow(expectedError.message);
    });
});

describe("addTag - Positive Tests", () => {
    const positiveCases: [string][] = [
        ["A"], ["AA"], ["A".repeat(50)], ["A".repeat(254)], ["A".repeat(255)]
    ];

    test.each(positiveCases)("should create a new tag with valid name: %s", async (tagName) => {
        const newTag = await addTag(tagName);
        expect(newTag).toBeDefined();
        expect(newTag.name).toBe(tagName);
    });
});

describe("addTag - Negative Tests", () => {
    const negativeCases: [string | number, Error][] = [
        ["", new BadRequestError("Tag name is required")],
        ["A".repeat(256), new ConflictError("Tag name cannot exceed 255 characters.")],
        [" ", new BadRequestError("Tag name is required")]
    ];

    test.each(negativeCases)("should throw an error for invalid tag name: %s", async (tagName, expectedError) => {
        await expect(addTag(String(tagName))).rejects.toThrow(expectedError.constructor);
        await expect(addTag(String(tagName))).rejects.toThrow(expectedError.message);
    });
});

describe("deleteTagById - Positive Tests", () => {
    test("should delete a tag successfully", async () => {
        const tagName = "Temporary Tag";
        const tag = await addTag(tagName);
        const deletedCount = await deleteTagById(tag.id);
        expect(deletedCount).toBe(1);
    });
});

describe("deleteTagById - Negative Tests", () => {
    const negativeCases: [number | string | null | undefined, Error][] = [
        [0, new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        [-1, new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        [-2, new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        [NaN, new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        [null, new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        [undefined, new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        ["invalid", new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        [9999, new NotFoundError("Tag not found")]
    ];

    test.each(negativeCases)("should throw an error for invalid tag id: %s", async (tagId, expectedError) => {
        await expect(deleteTagById(Number(tagId))).rejects.toThrow(expectedError.constructor);
        await expect(deleteTagById(Number(tagId))).rejects.toThrow(expectedError.message);
    });
});

