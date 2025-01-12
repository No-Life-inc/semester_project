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

describe("Tag Routes page and limit- Positive Tests", () => {
    const positiveCases: [string, string, number, (arg: any) => boolean, number][] = [
        ["should get default 10 tags", "/tag", 200, Array.isArray, 10],
        ["should get 1 tag", "/tag?limit=1", 200, Array.isArray, 1],
        ["should get 2 tag", "/tag?limit=2", 200, Array.isArray, 2],
        ["should get 25 tag", "/tag?limit=25", 200, Array.isArray, 25],
        ["should get 58 tags", "/tag?limit=58", 200, Array.isArray, 58],
        ["should get 59 tags", "/tag?limit=59", 200, Array.isArray, 59],
        ["should get 59 tags even though we asked for 60", "/tag?limit=60", 200, Array.isArray, 59],
        ["should get 59 tags even though we asked for 100", "/tag?limit=100", 200, Array.isArray, 59],
        ["should get 20 tags at page 1", "/tag?page=1&limit=20", 200, Array.isArray, 20],
        ["should get 20 tags at page 2", "/tag?page=2&limit=20", 200, Array.isArray, 20],
        ["should get 1 tags at page 25", "/tag?page=25&limit=1", 200, Array.isArray, 1],
        ["should get 1 tags at page 58", "/tag?page=58&limit=1", 200, Array.isArray, 1],
        ["should get 1 tags at page 59", "/tag?page=59&limit=1", 200, Array.isArray, 1],
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

describe("Tag Routes page and limit- Negative Tests", () => {
    const negativeCases: [string, string, number, string][] = [
        ["should return 400 if page is 0", "/tag?page=0&limit=10", 400, "Page must be a positive number greater than 0."],
        ["should return 400 if limit is 0", "/tag?page=1&limit=0", 400, "Limit must be a positive number greater than 0."],
        ["should return 400 if both page and limit are 0", "/tag?page=0&limit=0", 400, "Page must be a positive number greater than 0."],
        ["should return 400 if both page and limit are negative", "/tag?page=-1&limit=-1", 400, "Page must be a positive number greater than 0."],
        ["should return 400 if page is negative and limit is positive", "/tag?page=-1&limit=1", 400, "Page must be a positive number greater than 0."],
        ["should return 400 if page is positive and limit is negative", "/tag?page=1&limit=-1", 400, "Limit must be a positive number greater than 0."],
        ["should return 400 if limit exceeds maximum allowed", "/tag?page=1&limit=101", 400, "Limit must be a positive number less than or equal to 100."],
        ["should return 400 if page is valid but limit exceeds maximum allowed", "/tag?page=1&limit=101", 400, "Limit must be a positive number less than or equal to 100."],
        ["should return 400 if page exceeds maximum allowed", "/tag?page=100", 400, "Page 100 exceeds the maximum page number 6."],
        ["should return 400 if limit contains invalid characters", "/tag?page=1&limit=1a", 400, "Limit must be a positive number greater than 0."],
        ["should return 400 if page contains invalid characters", "/tag?page=1a&limit=1", 400, "Page must be a positive number greater than 0."],
        ["should return 400 if both page and limit contain invalid characters", "/tag?page=1a&limit=1a", 400, "Page must be a positive number greater than 0."],
        ["should return 400 if page contains spaces", "/tag?page= &limit=1", 400, "Page must be a positive number greater than 0."],
        ["should return 400 if limit contains spaces", "/tag?page=1&limit= ", 400, "Limit must be a positive number greater than 0."],
        ["should return 400 if both page and limit contain spaces", "/tag?page= &limit= ", 400, "Page must be a positive number greater than 0."],
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

describe("Tag Routes - Get Tag by ID Positive Tests", () => {
    const positiveCases: [string, string, number][] = [
        ["should return tag with status 200 for minimum valid ID", "/tag/1", 200],
        ["should return tag with status 200 for one above minimum valid ID", "/tag/2", 200],
        ["should return tag with status 200 for mid valid ID", "/tag/25", 200],
        ["should return tag with status 200 for one below upper boundary ID", "/tag/58", 200],
        ["should return tag with status 200 for upper boundary ID", "/tag/59", 200],
    ];

    test.each(positiveCases)(
        "%s",
        async (description, route, expectedStatus) => {
            const response = await request(app).get(route);

            expect(response.status).toBe(expectedStatus);
            expect(response.body).toHaveProperty("name");
        }
    );
});

describe("Tag Routes tag by id - Positive Tests", () => {
    const boundaryCases: [string, string, number][] = [
        ["should return 200 for valid id 1", "/tag/1", 200],
        ["should return 200 for valid id 2", "/tag/2", 200],
        ["should return 200 for valid id 25", "/tag/25", 200],
        ["should return 200 for valid id 58", "/tag/58", 200],
        ["should return 200 for valid id 59", "/tag/59", 200],
    ];

    test.each(boundaryCases)(
        "%s",
        async (description, endpoint, expectedStatus) => {
            const response = await request(app).get(endpoint);
            expect(response.status).toBe(expectedStatus);
            expect(response.body).toHaveProperty("name");
        }
    );
});


describe("Tag Routes tag by id- Negative Tests", () => {
    const negativeCases: [string, string, number, string][] = [
        ["should return 422 for invalid tag id", "/tag/0", 422, "Invalid tag id. Tag id must be a number greater than or equal to 1."],
        ["should return 404 for non-existing tag id", "/tag/9999", 404, "Tag not found"],
        ["should return 422 for invalid tag id", "/tag/-1", 422, "Invalid tag id. Tag id must be a number greater than or equal to 1."],
        ["should return 422 for invalid tag id", "/tag/a", 422, "Invalid tag id. Tag id must be a number greater than or equal to 1."],
        ["should return 404 not found tag for id 60", "/tag/60", 404, "Tag not found"],
        ["should return 404 not found tag for id 61", "/tag/61", 404, "Tag not found"],
        ["should return 422 for space as tag id", "/tag/%20", 422, "Invalid tag id. Tag id must be a number greater than or equal to 1."],
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

describe("Tag Routes - Add Tag Positive Tests", () => {
    type TagPayload = { name: string };

    const positiveCases: [string, TagPayload, number][] = [
        ["should create a new tag with a valid name", { name: "Extra Material" }, 201],
        ["should create a new tag with a minimum length name", { name: "A" }, 201],
        ["should create a new tag with one above minimum length", { name: "AB" }, 201],
        ["should create a new tag with one below maximum length", { name: "A".repeat(254) }, 201],
        ["should create a new tag with a maximum length name", { name: "A".repeat(255) }, 201],
        ["should create a new tag with a name containing numbers", { name: "Tag123" }, 201],
    ];

    test.each(positiveCases)(
        "%s",
        async (description, newTag, expectedStatus) => {
            const response = await request(app).post("/tag").send(newTag);

            expect(response.status).toBe(expectedStatus);
            expect(response.body).toHaveProperty("id");
            expect(response.body).toHaveProperty("name", newTag.name);
        }
    );
});

describe("Tag Routes add tag- Negative Tests", () => {
    const negativeCases: [string, Record<string, any>, number, string][] = [
        ["should return 400 if 'name' is missing in the request body", {}, 400, "Tag name is required"],
        ["should return 400 if the tag name already exists", { name: "Classic" }, 400, "Tag name already exists"],
        ["should return 409 if tag name exceeds 255 characters", { name: "A".repeat(256) }, 409, "Tag name cannot exceed 255 characters."],
        ["should return 400 if tag name is an empty string", { name: "" }, 400, "Tag name is required"],
        ["should return 400 if tag name is a space", { name: " " }, 400, "Tag name is required"],
        ["should return 400 if tag name is null", { name: null }, 400, "Tag name is required"],
        ["should return 400 if tag name is undefined", { name: undefined }, 400, "Tag name is required"],
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

describe("Tag Routes delete tag- Positive Tests", () => {
    test("should delete a tag with valid ID", async () => {
        const response = await request(app).delete("/tag/2");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Tag deleted successfully");
    });
});

describe("Tag Routes delete tag- Negative Tests", () => {
    const negativeCases: [string, string, number, string][] = [
        ["should return 404 if the tag to be deleted does not exist", "/tag/9999", 404, "Tag not found"],
        ["should return 400 for invalid tag id", "/tag/0", 422, "Invalid tag id. Tag id must be a number greater than or equal to 1."],
        ["should return 422 for invalid tag id", "/tag/-1", 422, "Invalid tag id. Tag id must be a number greater than or equal to 1."],
        ["should return 422 for invalid tag id", "/tag/a", 422, "Invalid tag id. Tag id must be a number greater than or equal to 1."],
        ["should return 404 not found tag for id 60", "/tag/100", 404, "Tag not found"],
        ["should return 422 for space as tag id", "/tag/%20", 422, "Invalid tag id. Tag id must be a number greater than or equal to 1."],
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
