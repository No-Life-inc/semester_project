import { afterAll, beforeAll, describe, expect, jest, test } from "@jest/globals";
import request from "supertest";
import express from "express";
import tagRouter from "../../routes/V1/tagRoutes";
import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";

jest.setTimeout(120000);

const app = express();
app.use(express.json());
app.use("/tag", tagRouter);

beforeAll(async () => {
    await setupTestDB();
});

afterAll(async () => {
    await teardownTestDB();
});

describe("Tag Routes - Positive Tests", () => {
    const positiveCases: [string, string, number, (arg: any) => boolean, number][] = [
        ["should get default 10 tags", "/tag", 200, Array.isArray, 10],
        ["should get 1 tag", "/tag?limit=1", 200, Array.isArray, 1],
        ["should get 50 tags", "/tag?limit=50", 200, Array.isArray, 50],
        ["should get all tags with a valid limit and page", "/tag?page=1&limit=20", 200, Array.isArray, 20],
    ];

    test.each(positiveCases)(
        "%s",
        async (description, route, expectedStatus, expectedBodyType, expectedLength) => {
            const response = await request(app).get(route);
            expect(response.status).toBe(expectedStatus);
            expect(expectedBodyType(response.body)).toBe(true);
            if (response.body.length !== 0) {
                expect(response.body.length).toBeLessThanOrEqual(expectedLength);
            }
        }
    );
});

describe("Tag Routes - Negative Tests", () => {
    const negativeCases: [string, string, number, string][] = [
        ["should return 400 for invalid page number", "/tag?page=0&limit=10", 400, "Page must be a positive number greater than 0."],
        ["should return 400 for invalid limit number", "/tag?page=1&limit=0", 400, "Limit must be a positive number greater than 0."],
        ["should return 400 for limit exceeding maximum", "/tag?page=1&limit=101", 400, "Limit must be a positive number less than or equal to 100."],
    ];

    test.each(negativeCases)(
        "%s",
        async (description, route, expectedStatus, expectedError) => {
            const response = await request(app).get(route);
            expect(response.status).toBe(expectedStatus);
            expect(response.body.error).toBe(expectedError);
        }
    );
});

describe("Tag Routes- Positive Tests", () => {
    test("should return tag with status 200 if valid id", async () => {
        const response = await request(app).get("/tag/1");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("name");
    });
});

describe("Tag Routes - Negative Tests", () => {
    const negativeCases: [string, string, number, string][] = [
        ["should return 400 for invalid tag id", "/tag/0", 400, "Invalid tag id. Tag id must be a number greater than or equal to 1."],
        ["should return 404 for non-existing tag id", "/tag/9999", 404, "Tag not found"],
    ];

    test.each(negativeCases)(
        "%s",
        async (description, route, expectedStatus, expectedError) => {
            const response = await request(app).get(route);
            expect(response.status).toBe(expectedStatus);
            expect(response.body.error).toBe(expectedError);
        }
    );
});

describe("Tag Routes - Positive Tests", () => {
    test("should create a new tag", async () => {
        const newTag = { name: "Extra Material" };
        const response = await request(app).post("/tag").send(newTag);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("name", "Extra Material");
    });
});

describe("Tag Routes - Negative Tests", () => {
    const negativeCases: [string, Record<string, any>, number, string][] = [
        ["should return 400 if 'name' is missing in the request body", {}, 400, "Tag name is required"],
        ["should return 400 if the tag name already exists", { name: "Classic" }, 400, "Tag name already exists"],
        ["should return 409 if tag name exceeds 255 characters", { name: "A".repeat(256) }, 409, "Tag name cannot exceed 255 characters."],
    ];

    test.each(negativeCases)(
        "%s",
        async (description, requestBody, expectedStatus, expectedError) => {
            const response = await request(app).post("/tag").send(requestBody);
            expect(response.status).toBe(expectedStatus);
            expect(response.body.error).toBe(expectedError);
        }
    );
});

describe("Tag Routes - Positive Tests", () => {
    test("should delete a tag with valid ID", async () => {
        const response = await request(app).delete("/tag/2");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Tag deleted successfully");
    });
});

describe("Tag Routes - Negative Tests", () => {
    const negativeCases: [string, string, number, string][] = [
        ["should return 404 if the tag to be deleted does not exist", "/tag/9999", 404, "Tag not found"],
        ["should return 400 for invalid tag id", "/tag/0", 400, "Invalid tag id. Tag id must be a number greater than or equal to 1."],
    ];

    test.each(negativeCases)(
        "%s",
        async (description, route, expectedStatus, expectedError) => {
            const response = await request(app).delete(route);
            expect(response.status).toBe(expectedStatus);
            expect(response.body.error).toBe(expectedError);
        }
    );
});
