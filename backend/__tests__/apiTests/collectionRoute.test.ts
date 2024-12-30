import {
  afterAll,
  beforeAll,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

jest.setTimeout(120000);

import express from "express";
import request from "supertest";
import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";
import collectionRoutes from "../../routes/V1/collectionRoutes";
import {
  userSetup,
  teardownUserSetup,
  getUserToken,
} from "../utility/userSetup";

beforeAll(async () => {
  await setupTestDB();
  await userSetup();
});

afterAll(async () => {
  await teardownTestDB();
  await teardownUserSetup();
});

const app = express();

app.use(express.json());
app.use("/collections", collectionRoutes);


// Positive Tests for GET /collections
describe("Collection Routes - Get Collections Positive tests", () => {
  test.each([
    ["should fetch collections for User 1", () => getUserToken(0), 200, true],
    ["should fetch collections for User 2", () => getUserToken(1), 200, true],
    ["should fetch collections for User 3", () => getUserToken(2), 200, true],
  ])("%s", async (description, getTokenFn, expectedStatus, isArray) => {
    const token = getTokenFn();

    const response = await request(app)
      .get("/collections")
      .set("Authorization", token ? `Bearer ${token}` : "");

    expect(response.status).toBe(expectedStatus);

    if (isArray) {
      expect(Array.isArray(response.body)).toBe(true);
    }
  });
});

// Negative Tests for GET /collections
describe("Collection Routes - Get Collections Negative tests", () => {
  test.each([
    [
      "should return 401 for missing token",
      null,
      401,
      { message: "Token not provided" },
    ],
    [
      "should return 401 for invalid token",
      "invalidToken",
      401,
      { message: "Invalid or expired token" },
    ],
  ])("%s", async (description, token, expectedStatus, expectedBody) => {
    const response = await request(app)
      .get("/collections")
      .set("Authorization", token ? `Bearer ${token}` : "");

    expect(response.status).toBe(expectedStatus);

    if (expectedBody) {
      expect(response.body).toMatchObject(expectedBody);
    }
  });
});

// Positive Tests for POST /collections
describe("Collection Routes - POST /collections Positive Tests", () => {
    test.each([
      ["should create a collection with a valid name", { name: "Test Collection" }, () => getUserToken(0), 201],
      ["should create a collection with minimum length name", { name: "A" }, () => getUserToken(0), 201],
      ["should create a collection with maximum length name", { name: "A".repeat(255) }, () => getUserToken(0), 201],
    ])(
      "%s",
      async (description, payload, getTokenFn, expectedStatus) => {
        const token = getTokenFn();
        const response = await request(app)
          .post("/collections")
          .set("Authorization", `Bearer ${token}`)
          .send(payload);
  
        expect(response.status).toBe(expectedStatus);
        expect(response.body).toHaveProperty("id");
        expect(response.body.name).toBe(payload.name);
      }
    );
  });

  // Negative Tests for POST /collections
  describe("Collection Routes - POST /collections Negative Tests", () => {
    test.each([
      ["should return 422 for missing name", {}, () => getUserToken(0), 422, { message: "Collection name is required" }],
      ["should return 422 for empty name", { name: "" }, () => getUserToken(0), 422, { message: "Collection name is required" }],
      ["should return 422 for name exceeding max length", { name: "A".repeat(256) }, () => getUserToken(0), 422, { message: "Collection name must be between 1 and 255 characters" }],
      ["should return 401 for missing token", { name: "Valid Name" }, () => null, 401, { message: "Token not provided" }],
      ["should return 401 for invalid token", { name: "Valid Name" }, () => "invalidToken", 401, { message: "Invalid or expired token" }],
    ])(
      "%s",
      async (description, payload, getTokenFn, expectedStatus, expectedBody) => {
        const token = getTokenFn();
        const response = await request(app)
          .post("/collections")
          .set("Authorization", token ? `Bearer ${token}` : "")
          .send(payload);
  
        expect(response.status).toBe(expectedStatus);
        if (expectedBody) {
          expect(response.body).toMatchObject(expectedBody);
        }
      }
    );
  });