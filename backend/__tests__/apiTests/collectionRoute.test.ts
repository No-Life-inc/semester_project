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
import {setupTestDB, teardownTestDB} from "../../database/knex/setupTestDB";
import collectionRoutes from "../../routes/V1/collectionRoutes";
import {userSetup, teardownUserSetup, getUserToken} from "../utility/userSetup";

beforeAll(async ()=>{
    await setupTestDB();
    await userSetup();
});

afterAll(async ()=>{
    await teardownTestDB();
    await teardownUserSetup();
});

const app = express();

app.use(express.json());
app.use("/collections", collectionRoutes);


// Positive Tests for GET /collections
test.each([
    ["should fetch collections for User 1", () => getUserToken(0), 200, true],
    ["should fetch collections for User 2", () => getUserToken(1), 200, true],
    ["should fetch collections for User 3", () => getUserToken(2), 200, true],
  ])(
    "%s",
    async (description, getTokenFn, expectedStatus, isArray) => {
      const token = getTokenFn();
  
      const response = await request(app)
        .get("/collections")
        .set("Authorization", token ? `Bearer ${token}` : "");
  
      expect(response.status).toBe(expectedStatus);
  
      if (isArray) {
        expect(Array.isArray(response.body)).toBe(true);
      }
    }
  );

 // Negative Tests for GET /collections
describe("Collection Routes - Get Collections Negative tests", () => {
    test.each([
      ["should return 401 for missing token", null, 401, { message: "Token not provided" }],
      ["should return 401 for invalid token", "invalidToken", 401, { message: "Invalid or expired token" }],
    ])(
      "%s",
      async (description, token, expectedStatus, expectedBody) => {
        const response = await request(app)
          .get("/collections")
          .set("Authorization", token ? `Bearer ${token}` : "");
  
        expect(response.status).toBe(expectedStatus);
  
        if (expectedBody) {
          expect(response.body).toMatchObject(expectedBody);
        }
      }
    );
  });