import { afterAll, beforeAll, describe, expect, jest, test } from "@jest/globals";
import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";
import { addTagToBook, deleteTagFromBook, getTagsForBook } from "../../services/userBookTagService";
import { ConflictError, NotFoundError } from "../../utility/errors";

jest.setTimeout(120000);

beforeAll(async () => {
    await setupTestDB();
});

afterAll(async () => {
    await teardownTestDB();
});

describe("addTagToBook - Positive Tests", () => {
    const positiveCases: [string, number, number, number][] = [
        ["should add a tag to a book with valid IDs", 1, 1, 1],
        ["should add another tag to the same book", 2, 1, 1],
    ];

    test.each(positiveCases)("%s", async (description, tagId, userBookId, userId) => {
        const result = await addTagToBook(tagId, userBookId, userId);
        expect(result).toBeDefined();
        expect(result.tagId).toBe(tagId);
        expect(result.userBookId).toBe(userBookId);
    });
});

describe("addTagToBook - Negative Tests", () => {
    const negativeCases: [string, number, number, number, Error][] = [
        ["should throw NotFoundError if book is not found", 1, 9999, 1, new NotFoundError("UserBook not found")],
        ["should throw ConflictError if user does not own the book", 1, 1, 2, new ConflictError("You do not have permission to modify this book")],
        ["should throw NotFoundError if tag is not found", 9999, 1, 1, new NotFoundError("Tag not found")],
        ["should throw ConflictError if tag already exists on the book", 1, 1, 1, new ConflictError("Tag already exists on the book")],
    ];

    test.each(negativeCases)("%s", async (description, tagId, userBookId, userId, expectedError) => {
        await expect(addTagToBook(tagId, userBookId, userId)).rejects.toThrowError(expectedError);
    });
});

describe("deleteTagFromBook - Positive Tests", () => {
    const positiveCases: [string, number, number, number][] = [
        ["should delete a tag from a book with valid IDs", 1, 1, 1],
        ["should delete another tag from the same book", 2, 1, 1],
    ];

    test.each(positiveCases)("%s", async (description, tagId, bookId, userId) => {
        const result = await deleteTagFromBook(tagId, bookId, userId);
        expect(result).toBe(1);
    });
});

describe("deleteTagFromBook - Negative Tests", () => {
    const negativeCases: [string, number, number, number, Error][] = [
        ["should throw NotFoundError if book is not found", 1, 9999, 1, new NotFoundError("UserBook not found")],
        ["should throw ConflictError if user does not own the book", 1, 1, 2, new ConflictError("You do not have permission to modify this book.")],
        ["should throw NotFoundError if tag is not found on the book", 9999, 1, 1, new NotFoundError("Tag not found on the book.")],
    ];

    test.each(negativeCases)("%s", async (description, tagId, bookId, userId, expectedError) => {
        await expect(deleteTagFromBook(tagId, bookId, userId)).rejects.toThrowError(expectedError);
    });
});

describe("getTagsForBook - Positive Tests", () => {
    const positiveCases: [string, number, number][] = [
        ["should return tags for a book the user owns", 1, 1],
    ];

    test.each(positiveCases)("%s", async (description, userBookId, userId) => {
        const tags = await getTagsForBook(userBookId, userId);
        expect(tags).toBeDefined();
        expect(tags.length).toBeGreaterThan(0);
    });
});

describe("getTagsForBook - Negative Tests", () => {
    const negativeCases: [string, number, number, Error][] = [
        ["should throw NotFoundError if book is not found", 9999, 1, new NotFoundError("UserBook not found")],
        ["should throw ConflictError if user does not own the book", 1, 2, new ConflictError("You do not have permission to view this book.")],
    ];

    test.each(negativeCases)("%s", async (description, userBookId, userId, expectedError) => {
        await expect(getTagsForBook(userBookId, userId)).rejects.toThrowError(expectedError);
    });
});
