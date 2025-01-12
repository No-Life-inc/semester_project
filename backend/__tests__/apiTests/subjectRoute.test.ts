import {
    afterAll,
    beforeAll,
    describe,
    expect,
    jest,
    test,
  } from "@jest/globals";
  
  import express from "express";
  import request from "supertest";
  import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";
  import router from "../../routes/V1/subjectRoutes";
  
  jest.setTimeout(120000);
  
  beforeAll(async () => {
    await setupTestDB();
  });
  
  afterAll(async () => {
    await teardownTestDB();
  });

  
  const app = express();
  
  // Setup middleware
  app.use(express.json());
  app.use('/subject', router);
  
  
  describe('Subject Routes - Get All Subjects Positive Tests', () => {
    test.each([
      ["should get 50 subjects", "/subject", 200, Array.isArray, 50],
      ["should get 100 subjects", "/subject?page=1&limit=100", 200, Array.isArray, 100],
      ["should get 50 subjects", "/subject?page=2&limit=50", 200, Array.isArray, 50],
      ["should get 2 subjects", "/subject?page=50&limit=2", 200, Array.isArray, 2],
      ["should get 1 subjects", "/subject?page=99&limit=1", 200, Array.isArray, 1],
      ["should get 1 subjects", "/subject?page=100&limit=1", 200, Array.isArray, 1],
      ["should get 1 subject", "/subject?limit=1", 200, Array.isArray, 1],
      ["should get 2 subject", "/subject?limit=2", 200, Array.isArray, 2],
      ["should get 50 subject ", "/subject?limit=50", 200, Array.isArray, 50],
      ["should get 99 subject", "/subject?limit=99", 200, Array.isArray, 99],
      ["should get 100 subject", "/subject?limit=100", 200, Array.isArray, 100],
      ["should get 100 subjects page 1", "/subject?page=1", 200, Array.isArray, 50],
      ["should get 50 subjects page 2", "/subject?page=2", 200, Array.isArray, 50],
      ["should get 50 subjects page 3", "/subject?page=3", 200, Array.isArray, 50],
      ["should get 34 subjects page 4", "/subject?page=4", 200, Array.isArray, 34],

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
  
  describe('Subject Routes - Get All Subjects Negative Tests', () => {
    test.each([
      ["should get 0 books limit 0", "/subject?limit=0", 422],
      ["should get 0 books limit -1", "/subject?limit=-1", 422],
      ["should get 0 books limit -2", "/subject?limit=-2", 422],
      ["should get 0 books limit 101", "/subject?limit=101", 422],
      ["should get 0 books limit 102", "/subject?limit=101", 422],
      ["should get 0 books limit NaN", "/subject?limit=NaN", 422],
      ["should get 0 books limit white space", "/subject?limit= ", 422],
      ["should get 0 books limit undefined", "/subject?limit=", 422],
      ["should get 0 books page 0", "/subject?page=0", 422],
      ["should get 0 books page -1", "/subject?page=-1", 422],
      ["should get 0 books page -2", "/subject?page=-2", 422],
      ["should get 0 books page NaN", "/subject?page=NaN", 422],
      ["should get 0 books page white space", "/subject?page= ", 422],
      ["should get 0 books page undefined", "/subject?page=", 422],
    ])(
      "%s",
      async (description, route, expectedStatus) => {
        const response = await request(app).get(route);
  
        expect(response.status).toBe(expectedStatus);
      }
    );
  });
  
  describe('Subject Routes - Get Subject By ID Positive Tests', () => {
    test.each([
      ["should get a subject by valid ID 1", "/subject/id/1", 200, (body) => body.id === 1],
      ["should get a subject by valid ID 2", "/subject/id/2", 200, (body) => body.id === 2],
      ["should get a subject by valid ID 50", "/subject/id/50", 200, (body) => body.id === 50],
      ["should get a subject by valid ID 99", "/subject/id/99", 200, (body) => body.id === 99],
      ["should get a subject by valid ID 100", "/subject/id/100", 200, (body) => body.id === 100],
    ])(
      "%s",
      async (description, route, expectedStatus, bodyAssertion) => {
        const response = await request(app).get(route);
  
        expect(response.status).toBe(expectedStatus);
        expect(bodyAssertion(response.body)).toBe(true);
      }
    );
  });
  
  describe('Subject Routes - Get Subject By ID Negative Tests', () => {
    test.each([
      ["should return error for invalid ID (0)", "/subject/id/0", 422],
      ["should return error for invalid ID (-1)", "/subject/id/-1", 422],
      ["should return error for invalid ID (-2)", "/subject/id/-2", 422],
      ["should return error for non-numeric ID", "/subject/id/NaN", 422],
      ["should return error for white space ID", "/subject/id/ ", 404],
      ["should return error for white space ID", "/subject/id/", 404],
      ["should return error for non-existent ID", "/subject/id/185", 404],
      ["should return error for non-existent ID", "/subject/id/186", 404],
    ])(
      "%s",
      async (description, route, expectedStatus) => {
        const response = await request(app).get(route);
  
        expect(response.status).toBe(expectedStatus);
      }
    );
  });
  