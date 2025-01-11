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
import tagRouter from "../../routes/V1/tagRoutes";
import {setupTestDB, teardownTestDB} from "../../database/knex/setupTestDB";

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

describe("Tag Routes - Get All Tags - Positive tests", () => {
    test.each([
        ["should get default 10 tags", "/tag", 200, Array.isArray, 10],
        ["should get 1 tag", "/tag?limit=1", 200, Array.isArray, 1],
        ["should get 5 tags", "/tag?limit=5", 200, Array.isArray, 5],
    ])(
        "%s",
        async (description, route, expectedStatus, expectedBodyType, expectedLength) => {
            const response = await request(app).get(route);
            expect(response.status).toBe(expectedStatus);
            expect(expectedBodyType(response.body)).toBe(true);
            if (response.body.length !== 0) {
                expect(response.body.length).toBe(expectedLength);
            }
        }
    );
});

describe("Tag Routes - Get Tag By Id - Positive tests", () => {
    test("should return tag with status 200 if valid id", async () => {
        const response = await request(app).get("/tag/1");
        expect(response.status).toBe(200);

        expect(response.body).toHaveProperty("name");
    });
});

describe("Tag Routes - Negative tests", () => {
    test.each([
        ["should return 400 for invalid tag id", "/tag/0", 400],
        ["should return 400 for negative tag id", "/tag/-1", 400],
    ])(
        "%s",
        async (description, route, expectedStatus) => {
            const response = await request(app).get(route);
            expect(response.status).toBe(expectedStatus);
        }
    );
});

describe("Tag Routes - POST Tag - Positive tests", () => {
    test("should create a new tag", async () => {
        const newTag = { name: "Fantasy" };
        const response = await request(app)
            .post("/tag")
            .send(newTag);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("name", "Fantasy");
    });
});

describe("Tag Routes - DELETE Tag - Positive tests", () => {
    test("should delete a tag with valid ID", async () => {
        const response = await request(app).delete("/tag/2");

        expect([200]).toContain(response.status);
        expect(response.body.message).toBe("Tag deleted successfully");

    });

    describe("Tag Routes - POST Tag - Negative tests", () => {
        test("should return 400 if 'name' is missing in the request body", async () => {
            const response = await request(app)
                .post("/tag")
                .send({});
            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Tag name is required");
        });


    test("should return 400 if the tag name already exists", async () => {
        const response = await request(app)
            .post("/tag")
            .send({ name: "Classic" });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Tag name already exists");
    });
});

    describe("Tag Routes - DELETE Tag - Negative tests", () => {
        test("should return 404 if the tag to be deleted does not exist", async () => {
            const response = await request(app).delete("/tag/9999");
            expect(response.status).toBe(404);
            expect(response.body.error).toBe("Tag not found");
        });
    })
});

