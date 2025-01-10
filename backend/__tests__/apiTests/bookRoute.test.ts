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
    "%s", 
    async (description, route, expectedStatus, expectedBodyType, expectedLength) => {
      const response = await request(app).get(route);

     
      expect(response.status).toBe(expectedStatus);
      
      
      expect(expectedBodyType(response.body)).toBe(true);
      
      
      expect(response.body.length).toBe(expectedLength);
    }
  );
});

describe('Book Routes - Get Books Negative tests', () => {
  
  test.each([
    ["should get 0 books", "/book/?limit=0", 400],
    ["should get 0 books", "/book/?limit=-1", 400],
    ["should get 0 books", "/book/?limit=-2", 400],
    ["should get 0 books", "/book/?limit=101", 400],
    ["should get 0 books", "/book/?limit=102", 400],
    ["should get 0 books", "/book/?page=0", 400],
    ["should get 0 books", "/book/?page=-1", 400],
    ["should get 0 books", "/book/?page=-2", 400],
    ["should get 0 books", "/book/?page=a", 400],
    ["should get 0 books", "/book/?limit=a", 400],
    ["should get 0 books", "/book/?limit= ", 400],
    ["should get 0 books", "/book/?page= ", 400],
  ])(
    "%s", 
    async (description, route, expectedStatus) => {
      const response = await request(app).get(route);

      
      expect(response.status).toBe(expectedStatus);
    }
  );
});


describe('Book Routes - Get Book By ID Positive tests', () => {
  
  test.each([
    ["should get a book by valid ID", "/book/id/1", 200, (body) => body.id === 1],
    ["should get a book by valid ID", "/book/id/2", 200, (body) => body.id === 2],
    ["should get a book by valid ID", "/book/id/99", 200, (body) => body.id === 99],
    ["should get a book by valid ID", "/book/id/100", 200, (body) => body.id === 100],
    ["should get a book by valid ID", "/book/id/50", 200, (body) => body.id === 50],
  ])( 
    "%s",
    async (description, route, expectedStatus, bodyAssertion) => {
      const response = await request(app).get(route);

      
      expect(response.status).toBe(expectedStatus);
      
      
      expect(bodyAssertion(response.body)).toBe(true);
    }
  );
});

describe('Book Routes - Get Book By ID Negative tests', () => {
  
  test.each([
    ["should get 404 for invalid ID", "/book/id/0", 400],
    ["should get 404 for invalid ID", "/book/id/-1", 400],
    ["should get 404 for invalid ID", "/book/id/-2", 400],
    ["should get 404 for invalid ID", "/book/id/101", 404],
    ["should get 404 for invalid ID", "/book/id/102", 404],
    ["should get 404 for invalid ID", "/book/id/a", 400],
    ["should get 404 for invalid ID", "/book/id/ ", 404],
  ])( 
    "%s",
    async (description, route, expectedStatus) => {
      const response = await request(app).get(route);

      
      expect(response.status).toBe(expectedStatus);
    }
  );
});

describe('Book Routes - Search Books Positive tests', () => {
 
  test.each([
    ["should get 1 book by title", "/book/search?title=Resting Scrooge Face: A Short Story", 200, Array.isArray, 1],
    ["should get 43 book by title", "/book/search?title=The", 200, Array.isArray, 43],

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

describe('Book Routes - Search Books Negative tests', () => {
  
  test.each([
    ["should get 0 books by title", "/book/search?title=", 400],
  ])( 
    "%s",
    async (description, route, expectedStatus) => {
      const response = await request(app).get(route);

      
      expect(response.status).toBe(expectedStatus);
    }
  );
}
);