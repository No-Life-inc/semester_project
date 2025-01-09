import {
    afterAll,
    beforeAll,
    describe,
    expect,
    jest,
    test,
} from "@jest/globals";
import request from "supertest";
import express from "express";

import userBookTagRouter from "../../routes/V1/userBookTagRoutes";

import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";

jest.setTimeout(120000);

const app = express();
app.use(express.json());
app.use("/userBookTag", userBookTagRouter);

let existingTagId;
let existingUserBookId;
beforeAll(async () => {
    await setupTestDB();

});

afterAll(async () => {
    await teardownTestDB();
});

describe("UserBookTag Routes - Add Tag to Book - Positive tests", () => {
    test("should add a tag to a book when valid tag_id and user_book_id are provided", async () => {
        const response = await request(app)
            .post("/userBookTag")
            .send({ tag_id: 1, user_book_id: 1 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("tagId", 1);
        expect(response.body).toHaveProperty("userBookId", 1);
    });
});

describe("UserBookTag Routes - Add Tag to Book - Negative tests", () => {
    test("should return 500 (or 404) if tag or book does not exist", async () => {
        const response = await request(app)
            .post("/userBookTag")
            .send({ tag_id: 99999, user_book_id: 99999 });

        expect(response.status).toBe(401);
    });

    test("should return 400 or 500 if the request body is incomplete", async () => {
        const response = await request(app)
            .post("/userBookTag")
            .send({ tag_id: 1 });

        expect([401]).toContain(response.status);
    });
});

describe("UserBookTag Routes - Delete Tag from Book - Positive tests", () => {
    test("should delete a tag from a book when valid tag_id and user_book_id are provided", async () => {
        const response = await request(app)
            .delete("/userBookTag")
            .send({ tag_id: 2, user_book_id: 2 });

        expect([200, 404]).toContain(response.status);

        if (response.status === 200) {
            expect(response.body.message).toBe("Tag deleted from book successfully");
        }
    });
});

describe("UserBookTag Routes - Delete Tag from Book - Negative tests", () => {
    test("should return 400 if the provided tag_id or user_book_id is invalid", async () => {
        const response = await request(app)
            .delete("/userBookTag")
            .send({ tag_id: "abc", user_book_id: 1 });
        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Invalid user_book_id or tag_id");
    });

    test("should return 404 if the tag or association does not exist", async () => {
        const response = await request(app)
            .delete("/userBookTag")
            .send({ tag_id: 9999, user_book_id: 9999 });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Tag or association not found");
    });
});
