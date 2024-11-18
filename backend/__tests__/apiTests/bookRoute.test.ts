import {
  afterAll,
  beforeAll,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

jest.setTimeout(30000);

import express from "express";
import request from "supertest";
import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";
import router from "../../routes/V1/bookRoutes";

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

const app = express();

// Setup middleware
app.use(express.json());
app.use('/book', router);

describe('Book Routes - Get Books  Positive tests', () => {
  // Parameterized test for getting all books
  test.each([
    ["should get 50 books", "/book/", 200, Array.isArray, 50],
    ["should get 1 book", "/book/?limit=1", 200, Array.isArray, 1],
    ["should get 2 books", "/book/?limit=2", 200, Array.isArray, 2],
    ["should get 1 books on page 100", "/book/?page=100&limit=1", 200, Array.isArray, 1],
    ["should get 99 books on page 1", "/book/?limit=99", 200, Array.isArray, 99],
    ["should get 100 books on page 1", "/book/?limit=100", 200, Array.isArray, 100],
    ["should get default 50 books on page 1", "/book/?page=1", 200, Array.isArray, 50],
    ["should get default 50 books on page 2", "/book/?page=2", 200, Array.isArray, 50],

  ])(
    "%s", // Use the description for each test
    async (description, route, expectedStatus, expectedBodyType, expectedLength) => {
      const response = await request(app).get(route);

      // Check the response status
      expect(response.status).toBe(expectedStatus);
      
      // Check the response body is an array
      expect(expectedBodyType(response.body)).toBe(true);
      
      // Check the number of books
      expect(response.body.length).toBe(expectedLength);
    }
  );
});

describe('Book Routes - Get Book By ID Positive tests', () => {
  // Parameterized test for getting a book by ID
  test.each([
    ["should get a book by valid ID", "/book/id/1", 200, (body) => body.id === 1],
    ["should get a book by valid ID", "/book/id/2", 200, (body) => body.id === 2],
    ["should get a book by valid ID", "/book/id/99", 200, (body) => body.id === 99],
    ["should get a book by valid ID", "/book/id/100", 200, (body) => body.id === 100],
    ["should get a book by valid ID", "/book/id/50", 200, (body) => body.id === 50],
  ])( // Use the description for each test
    "%s",
    async (description, route, expectedStatus, bodyAssertion) => {
      const response = await request(app).get(route);

      // Check the response status
      expect(response.status).toBe(expectedStatus);
      
      // Check the response body
      expect(bodyAssertion(response.body)).toBe(true);
    }
  );
});

