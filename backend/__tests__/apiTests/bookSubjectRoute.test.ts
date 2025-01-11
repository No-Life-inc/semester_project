import { afterAll, beforeAll, describe, expect, jest, test } from "@jest/globals";
import express from "express";
import request from "supertest";
import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";
import router from "../../routes/V1/bookSubjectRoutes";

jest.setTimeout(120000);

const app = express();
app.use(express.json());
app.use('/bookSubject', router);

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

describe('Book Subject Routes - Get Books By Subject Positive Tests', () => {
  test.each([
    ["should get books for subject with ID 1", "/bookSubject/1", 200, Array.isArray, 38],
    ["should get books for subject with ID 1", "/bookSubject/1?limit=1", 200, Array.isArray, 1],
    ["should get books for subject with ID 50", "/bookSubject/50?limit=2", 200, Array.isArray, 2],
    ["should get books for subject with ID 1", "/bookSubject/1?page=1&limit=10", 200, Array.isArray, 10],
    ["should get books for subject with ID 2", "/bookSubject/2?page=1&limit=5", 200, Array.isArray, 5],
    ["should get books for subject with ID 50", "/bookSubject/50?page=1&limit=2", 200, Array.isArray, 2],

  ])(
    "%s",
    async (description, route, expectedStatus, expectedBodyType, expectedLength) => {
      const response = await request(app).get(route);

      expect(response.status).toBe(expectedStatus);

      expect(expectedBodyType(response.body)).toBe(true);

      expect(response.body.length).toBe(expectedLength);
    }
  );
});

describe('Book Subject Routes - Get Books By Subject Negative Tests', () => {
  test.each([
    ["should return error for invalid subject ID (0)", "/bookSubject/0", 400],
    ["should return error for invalid subject ID (-1)", "/bookSubject/-1", 400],
    ["should return error for non-numeric subject ID", "/bookSubject/NaN", 400],
    ["should return error for invalid limit (0)", "/bookSubject/1?page=1&limit=0", 400],
    ["should return error for invalid limit (-10)", "/bookSubject/1?page=1&limit=-10", 400],
    ["should return error for limit exceeding max (101)", "/bookSubject/1?page=1&limit=101", 400],
    ["should return error for invalid page (-1)", "/bookSubject/1?page=-1&limit=10", 400],
    ["should return error for non-numeric page", "/bookSubject/1?page=a&limit=10", 400],
  ])(
    "%s",
    async (description, route, expectedStatus) => {
      const response = await request(app).get(route);

      expect(response.status).toBe(expectedStatus);
    }
  );
});
