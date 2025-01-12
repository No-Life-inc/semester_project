import { afterAll, beforeAll, describe, expect, jest, test } from "@jest/globals";
import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";
import { addTagToBook, deleteTagFromBook, getTagsForBook } from "../../services/userBookTagService";
import { ConflictError, NotFoundError, ValidationError } from "../../utility/errors";

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
    const negativeCases: [string, number | null | undefined, number | null | undefined, number | null | undefined, Error][] = [
        ["should throw NotFoundError if book is not found", 1, 9999, 1, new NotFoundError("UserBook not found")],
        ["should throw ValidationError if book id is wrong", 1, -1, 1, new ValidationError("Invalid Book id. Book id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if book id is wrong", 1, -2, 1, new ValidationError("Invalid Book id. Book id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if book id is wrong", 1, 0, 1, new ValidationError("Invalid Book id. Book id must be a number greater than or equal to 1.")],
        ["should throw NotFoundError if book is not found", 1, 4, 1, new NotFoundError("UserBook not found")],
        ["should throw NotFoundError if book is not found", 1, 5, 1, new NotFoundError("UserBook not found")],
        ["should throw ValidationError if book id is wrong", 1, NaN, 1, new ValidationError("Invalid Book id. Book id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if book id is wrong", 1, null, 1, new ValidationError("Invalid Book id. Book id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if book id is wrong", 1, undefined, 1, new ValidationError("Invalid Book id. Book id must be a number greater than or equal to 1.")],
        ["should throw ConflictError if user does not own the book", 1, 1, 2, new ConflictError("You do not have permission to modify this book")],
        ["should throw NotFoundError if tag is not found", 9999, 1, 1, new NotFoundError("Tag not found")],
        ["should throw ValidationError if tag is wrong", -1, 1, 1, new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if tag is wrong", -2, 1, 1, new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if tag is wrong", 0, 1, 1, new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        ["should throw NotFoundError if tag is not found", 60, 1, 1, new NotFoundError("Tag not found")],
        ["should throw NotFoundError if tag is not found", 61, 1, 1, new NotFoundError("Tag not found")],
        ["should throw ValidationError if tag is wrong", NaN, 1, 1, new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if tag is wrong", null, 1, 1, new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if tag is wrong", undefined, 1, 1, new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if user id is wrong", 1, 1, -1, new ValidationError("Invalid User id. User id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if user id is wrong", 1, 1, -2, new ValidationError("Invalid User id. User id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if user id is wrong", 1, 1, 0, new ValidationError("Invalid User id. User id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if user id is wrong", 1, 1, NaN, new ValidationError("Invalid User id. User id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if user id is wrong", 1, 1, null, new ValidationError("Invalid User id. User id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if user id is wrong", 1, 1, undefined, new ValidationError("Invalid User id. User id must be a number greater than or equal to 1.")],
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
    const negativeCases: [string, number | null | undefined, number | null | undefined, number, Error][] = [
        ["should throw NotFoundError if book is not found", 1, 9999, 1, new NotFoundError("UserBook not found")],
        ["should throw ValidationError if book id is wrong", 1, -1, 1, new ValidationError("Invalid Book id. Book id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if book id is wrong", 1, -2, 1, new ValidationError("Invalid Book id. Book id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if book id is wrong", 1, 0, 1, new ValidationError("Invalid Book id. Book id must be a number greater than or equal to 1.")],
        ["should throw NotFoundError if book is not found", 1, 101, 1, new NotFoundError("UserBook not found")],
        ["should throw NotFoundError if book is not found", 1, 102, 1, new NotFoundError("UserBook not found")],
        ["should throw ValidationError if book id is wrong", 1, NaN, 1, new ValidationError("Invalid Book id. Book id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if book id is wrong", 1, null, 1, new ValidationError("Invalid Book id. Book id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if book id is wrong", 1, undefined, 1, new ValidationError("Invalid Book id. Book id must be a number greater than or equal to 1.")],
        ["should throw ConflictError if user does not own the book", 1, 1, 2, new ConflictError("You do not have permission to modify this book.")],
        ["should throw NotFoundError if tag is not found on the book", 9999, 1, 1, new NotFoundError("Tag not found")],
        ["should throw ValidationError if tag is wrong", -1, 1, 1, new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if tag is wrong", -2, 1, 1, new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if tag is wrong", 0, 1, 1, new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        ["should throw NotFoundError if tag is not found on the book", 60, 1, 1, new NotFoundError("Tag not found")],
        ["should throw NotFoundError if tag is not found on the book", 61, 1, 1, new NotFoundError("Tag not found")],
        ["should throw ValidationError if tag is wrong", NaN, 1, 1, new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if tag is wrong", null, 1, 1, new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if tag is wrong", undefined, 1, 1, new ValidationError("Invalid tag id. Tag id must be a number greater than or equal to 1.")],
        ["should throw NotFoundError if book is not found", 1, 1, 4, new ConflictError("You do not have permission to modify this book.")],
        ["should throw NotFoundError if book is not found", 1, 1, 5, new ConflictError("You do not have permission to modify this book.")],
        ["should throw ValidationError if user id is wrong", 1, 1, -1, new ValidationError("Invalid User id. User id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if user id is wrong", 1, 1, -2, new ValidationError("Invalid User id. User id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if user id is wrong", 1, 1, 0, new ValidationError("Invalid User id. User id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if user id is wrong", 1, 1, "a" as any, new ValidationError("Invalid User id. User id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if user id is wrong", 1, 1, NaN, new ValidationError("Invalid User id. User id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if user id is wrong", 1, 1, null, new ValidationError("Invalid User id. User id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if user id is wrong", 1, 1, undefined, new ValidationError("Invalid User id. User id must be a number greater than or equal to 1.")],

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
    const negativeCases: [string, number | null | undefined, number | null | undefined, Error][] = [
        ["should throw NotFoundError if book is not found", 9999, 1, new NotFoundError("UserBook not found")],
        ["should throw ValidationError if book id is wrong", -1, 1, new ValidationError("Invalid Book id. Book id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if book id is wrong", -2, 1, new ValidationError("Invalid Book id. Book id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if book id is wrong", 0, 1, new ValidationError("Invalid Book id. Book id must be a number greater than or equal to 1.")],
        ["should throw NotFoundError if book is not found", 4, 1, new NotFoundError("UserBook not found")],
        ["should throw NotFoundError if book is not found", 5, 1, new NotFoundError("UserBook not found")],
        ["should throw ValidationError if book id is wrong", NaN, 1, new ValidationError("Invalid Book id. Book id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if book id is wrong", null, 1, new ValidationError("Invalid Book id. Book id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if book id is wrong", undefined, 1, new ValidationError("Invalid Book id. Book id must be a number greater than or equal to 1.")],
        ["should throw ConflictError if user does not own the book", 1, 2, new ConflictError("You do not have permission to view this book.")],
        ["should throw ValidationError if user id is wrong", 1, -1, new ValidationError("Invalid User id. User id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if user id is wrong", 1, -2, new ValidationError("Invalid User id. User id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if user id is wrong", 1, 0, new ValidationError("Invalid User id. User id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if user id is wrong", 1, NaN, new ValidationError("Invalid User id. User id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if user id is wrong", 1, null, new ValidationError("Invalid User id. User id must be a number greater than or equal to 1.")],
        ["should throw ValidationError if user id is wrong", 1, undefined, new ValidationError("Invalid User id. User id must be a number greater than or equal to 1.")],
    ];

    test.each(negativeCases)("%s", async (description, userBookId, userId, expectedError) => {
        await expect(getTagsForBook(userBookId, userId)).rejects.toThrowError(expectedError);
    });
});
