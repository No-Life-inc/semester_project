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
    ["should get books for subject with ID 1", "/bookSubject/1", 200, Array.isArray, 10],
    ["should get books for subject with ID 2", "/bookSubject/2", 200, Array.isArray, 10],
    ["should get books for subject with ID 50", "/bookSubject/50", 200, Array.isArray, 2],
    ["should get books for subject with ID 99", "/bookSubject/99", 200, Array.isArray, 2],
    ["should get books for subject with ID 100", "/bookSubject/100", 200, Array.isArray, 1],
    ["should get 1 book for subject with ID 1", "/bookSubject/1?limit=1", 200, Array.isArray, 1],
    ["should get 2 books for subject with ID 1", "/bookSubject/1?limit=2", 200, Array.isArray, 2],
    ["should get 19 books for subject with ID 1", "/bookSubject/1?limit=19", 200, Array.isArray, 19],
    ["should get 37 books for subject with ID 1", "/bookSubject/1?limit=37", 200, Array.isArray, 37],
    ["should get 38 books for subject with ID 1", "/bookSubject/1?limit=38", 200, Array.isArray, 38],
    ["should get 10 book for subject with ID 1 on page 1", "/bookSubject/1?page=1", 200, Array.isArray, 10],
    ["should get 10 book for subject with ID 1 on page 2", "/bookSubject/1?page=2", 200, Array.isArray, 10],
    ["should get 10 book for subject with ID 1 on page 3", "/bookSubject/1?page=3", 200, Array.isArray, 10],
    ["should get 8 book for subject with ID 1 on page 4", "/bookSubject/1?page=4", 200, Array.isArray, 8],
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
    ["should get 0 books with ID 0", "/bookSubject/0", 422],
    ["should get 0 books with ID -1", "/bookSubject/-1", 422],
    ["should get 0 books with ID -2", "/bookSubject/-2", 422],
    ["should get 0 books with ID NaN", "/bookSubject/NaN", 422],
    ["should get 0 books with ID white space", "/bookSubject/ ", 404],
    ["should get 0 books with ID undefined", "/bookSubject/", 404],
    ["should get 0 books with ID 185", "/bookSubject/185", 404],
    ["should get 0 books with ID 186", "/bookSubject/186", 404],
    ["should get 0 books with limit 0", "/bookSubject/1?limit=0", 422],
    ["should get 0 books with limit -1", "/bookSubject/1?limit=-1", 422],
    ["should get 0 books with limit -2", "/bookSubject/1?limit=-2", 422],
    ["should get 0 books with limit NaN", "/bookSubject/1?limit=NaN", 422],
    ["should get 0 books with limit white space", "/bookSubject/1?limit= ", 422],
    ["should get 0 books limit undefined", "/bookSubject/1?limit=", 422],
    ["should get 0 books limit 101", "/bookSubject/1?limit=101", 422],
    ["should get 0 books limit 102", "/bookSubject/1?limit=102", 422],
    ["should get 0 books page 0", "/bookSubject/1?page=0", 422],
    ["should get 0 books page -1", "/bookSubject/1?page=-1", 422],
    ["should get 0 books page -2", "/bookSubject/1?page=-2", 422],
    ["should get 0 books page NaN", "/bookSubject/1?page=NaN", 422],
    ["should get 0 books page white space", "/bookSubject/1?page= ", 422],
    ["should get 0 books page undefined", "/bookSubject/1?page=", 422],


  ])(
    "%s",
    async (description, route, expectedStatus) => {
      const response = await request(app).get(route);

      expect(response.status).toBe(expectedStatus);
    }
  );
});
