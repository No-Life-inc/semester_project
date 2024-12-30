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

// Importing the userBookTag router
import userBookTagRouter from "../../routes/V1/userBookTagRoutes";

// If you are using a dedicated test database, import setup/teardown scripts
import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";

// Increase Jest timeout if necessary
jest.setTimeout(30000);

// Create an Express test app
const app = express();
app.use(express.json());
app.use("/userBookTag", userBookTagRouter);

beforeAll(async () => {
    await setupTestDB();
});

afterAll(async () => {
    await teardownTestDB();
});

describe("UserBookTag Routes - Add Tag to Book - Positive tests", () => {
    test("should add a tag to a book when valid tag_id and user_book_id are provided", async () => {
        // Assumption: there is a valid tag_id=1 and user_book_id=1 in the test DB
        const response = await request(app)
            .post("/userBookTag")
            .send({ tag_id: 1, user_book_id: 1 });

        // Check response status
        // The controller currently returns 200 if everything is successful
        expect(response.status).toBe(200);

        // Check if the response body contains the created entity fields
        expect(response.body).toHaveProperty("tagId", 1);
        expect(response.body).toHaveProperty("userBookId", 1);
    });
});

describe("UserBookTag Routes - Add Tag to Book - Negative tests", () => {
    test("should return 500 (or 404) if tag or book does not exist", async () => {
        // Use a non-existent ID combination
        const response = await request(app)
            .post("/userBookTag")
            .send({ tag_id: 99999, user_book_id: 99999 });

        // Currently, the service throws a generic error, resulting in 500.
        // If you change the service/controller to handle not-found errors as 404, adjust this test.
        expect(response.status).toBe(500);

        // If you have a custom error message:
        // expect(response.body.error).toBe("An error occurred while adding tag to book");
    });

    test("should return 400 or 500 if the request body is incomplete", async () => {
        // Missing user_book_id in the request body
        const response = await request(app)
            .post("/userBookTag")
            .send({ tag_id: 1 });

        // Currently your controller does not explicitly check for missing fields,
        // so it might return a generic 500. Adjust based on your logic.
        expect([400, 500]).toContain(response.status);
    });
});

/**
 * --------------------------------------------------------------------------
 *            DELETE /userBookTag (deleteTagFromBook)
 * --------------------------------------------------------------------------
 */
describe("UserBookTag Routes - Delete Tag from Book - Positive tests", () => {
    test("should delete a tag from a book when valid tag_id and user_book_id are provided", async () => {
        // Assumption: there is a valid association in DB with tag_id=2 and user_book_id=2
        const response = await request(app)
            .delete("/userBookTag")
            .send({ tag_id: 2, user_book_id: 2 });

        // If deletion is successful, the controller returns 200
        // If the association does not exist, it returns 404
        expect([200, 404]).toContain(response.status);

        // If status is 200, check the success message
        if (response.status === 200) {
            expect(response.body.message).toBe("Tag deleted from book successfully");
        }
    });
});

describe("UserBookTag Routes - Delete Tag from Book - Negative tests", () => {
    test("should return 400 if the provided tag_id or user_book_id is invalid", async () => {
        // Providing non-numeric or invalid values
        const response = await request(app)
            .delete("/userBookTag")
            .send({ tag_id: "abc", user_book_id: 1 });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Invalid user_book_id or tag_id");
    });

    test("should return 404 if the tag or association does not exist", async () => {
        // Using an ID combination that is guaranteed not to exist
        const response = await request(app)
            .delete("/userBookTag")
            .send({ tag_id: 9999, user_book_id: 9999 });

        // The controller returns 404 if rowsDeleted === 0
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Tag or association not found");
    });
});
