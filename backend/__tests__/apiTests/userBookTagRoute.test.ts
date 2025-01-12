import { afterAll, beforeAll, describe, expect, jest, test } from "@jest/globals";
import request from "supertest";
import express from "express";
import userBookTagRouter from "../../routes/V1/userBookTagRoutes";
import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";
import {getUserToken, teardownUserSetup, userSetup} from "../utility/userSetup";

jest.setTimeout(120000);

const app = express();
app.use(express.json());
app.use("/userBookTag", userBookTagRouter);

beforeAll(async () => {
    await setupTestDB();
    await userSetup();
});

afterAll(async () => {
    await teardownTestDB();
    await teardownUserSetup();
});

describe("Add Tag to Book - Positive Tests", () => {
    test("should add a tag to a book successfully", async () => {
        const token = getUserToken(0);
        const requestBody = { tag_id: 1, user_book_id: 1 };

        const response = await request(app)
            .post("/userBookTag")
            .set("Authorization", `Bearer ${token}`)
            .send(requestBody);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("tagId", requestBody.tag_id);
        expect(response.body).toHaveProperty("userBookId", requestBody.user_book_id);
    });
});

describe("Add Tag to Book - Negative Tests", () => {
    const negativeCases: [string, { tag_id?: number | string; user_book_id?: number | string }, number, string][] = [
        ["should return 400 if only tag_id is missing", { user_book_id: 1 }, 400, "Invalid tag_id or user_book_id"],
        ["should return 400 if only user_book_id is missing", { tag_id: 1 }, 400, "Invalid tag_id or user_book_id"],
        ["should return 400 if user_book_id is 0", { user_book_id: 0, tag_id: 1 }, 400, "Invalid tag_id or user_book_id"],
        ["should return 400 if tag_id is 0", { user_book_id: 1, tag_id: 0 }, 400, "Invalid tag_id or user_book_id"],
        ["should return 400 if both user_book_id and tag_id are 0", { user_book_id: 0, tag_id: 0 }, 400, "Invalid tag_id or user_book_id"],
        ["should return 422 if user_book_id is -1", { user_book_id: -1, tag_id: 1 }, 422, "Invalid Book id. Book id must be a number greater than or equal to 1."],
        ["should return 422 if tag_id is -1", { user_book_id: 1, tag_id: -1 }, 422, "Invalid tag id. Tag id must be a number greater than or equal to 1."],
        ["should return 422 if both user_book_id and tag_id are -1", { user_book_id: -1, tag_id: -1 }, 422, "Invalid Book id. Book id must be a number greater than or equal to 1."],
        ["should return 400 if tag_id is 'a'", { user_book_id: 1, tag_id: "a" }, 400, "Invalid tag_id or user_book_id"],
        ["should return 400 if user_book_id is 'a'", { user_book_id: "a", tag_id: 1 }, 400, "Invalid tag_id or user_book_id"],
        ["should return 400 if user_book_id and tag_id are 'a'", { user_book_id: "a", tag_id: "a" }, 400, "Invalid tag_id or user_book_id"],
        ["should return 422 if user_book_id is an empty string", { user_book_id: " ", tag_id: 1 }, 422, "Invalid Book id. Book id must be a number greater than or equal to 1."],
        ["should return 422 if tag_id is an empty string", { user_book_id: 1, tag_id: " " }, 422, "Invalid tag id. Tag id must be a number greater than or equal to 1."],
        ["should return 400 if both fields are missing", {}, 400, "Invalid tag_id or user_book_id"],
    ];

    test.each(negativeCases)(
        "%s",
        async (description, requestBody, expectedStatus, expectedError) => {
            const token = getUserToken(0);

            const response = await request(app)
                .post("/userBookTag")
                .set("Authorization", `Bearer ${token}`)
                .send(requestBody);

            expect(response.status).toBe(expectedStatus);
            expect(response.body.error).toBe(expectedError);
        }
    );
});

describe("Delete Tag from Book - Positive Tests", () => {
    test("should delete a tag from a book successfully", async () => {
        const token = getUserToken(0);
        const requestBody = { tag_id: 1, user_book_id: 1 };

        const response = await request(app)
            .delete("/userBookTag")
            .set("Authorization", `Bearer ${token}`)
            .send(requestBody);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Tag deleted from book successfully");
    });
});

describe("Delete Tag from Book - Negative Tests", () => {
    const negativeCases: [string, { tag_id?: number | string; user_book_id?: number | string}, number, string][] = [
        ["should return 400 if tag_id is missing", { user_book_id: 1 }, 400, "Invalid tag_id or user_book_id"],
        ["should return 400 if user_book_id is missing", { tag_id: 1 }, 400, "Invalid tag_id or user_book_id"],
        ["should return 404 if tag not found", { tag_id: 9999, user_book_id: 1 }, 404, "Tag not found"],
        ["should return 404 if userBook not found", { tag_id: 1, user_book_id: 9999 }, 404, "UserBook not found"],
        ["should return 400 if tag_id is 0", { tag_id: 0, user_book_id: 1 }, 400, "Invalid tag_id or user_book_id"],
        ["should return 400 if user_book_id is 0", { tag_id: 1, user_book_id: 0 }, 400, "Invalid tag_id or user_book_id"],
        ["should return 400 if both tag_id and user_book_id are 0", { tag_id: 0, user_book_id: 0 }, 400, "Invalid tag_id or user_book_id"],
        ["should return 422 if tag_id is -1", { tag_id: -1, user_book_id: 1 }, 422, "Invalid tag id. Tag id must be a number greater than or equal to 1."],
        ["should return 422 if user_book_id is -1", { tag_id: 1, user_book_id: -1 }, 422, "Invalid Book id. Book id must be a number greater than or equal to 1."],
        ["should return 422 if both tag_id and user_book_id are -1", { tag_id: -1, user_book_id: -1 }, 422, "Invalid Book id. Book id must be a number greater than or equal to 1."],
        ["should return 400 if tag_id is 'a'", { tag_id: "a", user_book_id: 1 }, 400, "Invalid tag_id or user_book_id"],
        ["should return 400 if user_book_id is 'a'", { tag_id: 1, user_book_id: "a" }, 400, "Invalid tag_id or user_book_id"],
        ["should return 400 if both tag_id and user_book_id are 'a'", { tag_id: "a", user_book_id: "a" }, 400, "Invalid tag_id or user_book_id"],
        ["should return 422 if tag_id is an empty string", { tag_id: " ", user_book_id: 1 }, 422, "Invalid tag id. Tag id must be a number greater than or equal to 1."],
        ["should return 422 if user_book_id is an empty string", { tag_id: 1, user_book_id: " " }, 422, "Invalid Book id. Book id must be a number greater than or equal to 1."],
        ["should return 400 if both fields are missing", {}, 400, "Invalid tag_id or user_book_id"],
    ];

    test.each(negativeCases)(
        "%s",
        async (description, requestBody, expectedStatus, expectedError) => {
            const token = getUserToken(0);

            const response = await request(app)
                .delete("/userBookTag")
                .set("Authorization", `Bearer ${token}`)
                .send(requestBody);

            expect(response.status).toBe(expectedStatus);
            expect(response.body.error).toBe(expectedError);
        }
    );
});

describe("Get Tags for Book - Positive Tests", () => {
    test("should get tags for a book successfully", async () => {
        const token = getUserToken(0);
        const userBookId = 1;

        const response = await request(app)
            .get(`/userBookTag/${userBookId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});

describe("Get Tags for Book - Negative Tests", () => {
    const negativeCases: [string, string, number, string][] = [
        ["should return 400 for invalid userBookId", "/userBookTag/0", 400, "userBookId is required"],
        ["should return 404 if no tags found for the book", "/userBookTag/9999", 404, "UserBook not found"],
        ["should return 400 for userBookId with letters", "/userBookTag/a", 400, "userBookId is required"],
        ["should return 400 for userBookId with negative value", "/userBookTag/-1", 400, "userBookId is required"],
        ["should return 404 for userBookId with no tags", "/userBookTag/2", 409, "You do not have permission to view this book."],
        ["should return 400 for userBookId with space", "/userBookTag/%20", 400, "userBookId is required"],
    ];

    test.each(negativeCases)(
        "%s",
        async (description, route, expectedStatus, expectedError) => {
            const token = getUserToken(0);

            const response = await request(app)
                .get(route)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(expectedStatus);
            expect(response.body.error).toBe(expectedError);
        }
    );
});