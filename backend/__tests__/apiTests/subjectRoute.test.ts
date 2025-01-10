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
  
  const app = express();
  
  // Setup middleware
  app.use(express.json());
  app.use('/subject', router);
  
  beforeAll(async () => {
    await setupTestDB();
  });
  
  afterAll(async () => {
    await teardownTestDB();
  });
  
  describe('Subject Routes - Get All Subjects Positive Tests', () => {
    test.each([
      ["should get 50 subjects", "/subject", 200, Array.isArray, 50],
      ["should get 1 subject", "/subject?page=1&limit=1", 200, Array.isArray, 1],
      ["should get 10 subjects", "/subject?page=1&limit=10", 200, Array.isArray, 10],
      ["should get 100 subjects (max limit)", "/subject?page=1&limit=100", 200, Array.isArray, 100],
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
      ["should return error for invalid limit (0)", "/subject?page=1&limit=0", 400],
      ["should return error for invalid limit (-1)", "/subject?page=1&limit=-1", 400],
      ["should return error for invalid limit (101)", "/subject?page=1&limit=101", 400],
      ["should return error for invalid page (-1)", "/subject?page=-1&limit=10", 400],
      ["should return error for non-numeric limit", "/subject?page=1&limit=a", 400],
      ["should return error for non-numeric page", "/subject?page=a&limit=10", 400],
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
      ["should get a subject by valid ID", "/subject/1", 200, (body) => body.id === 1],
      ["should get another subject by valid ID", "/subject/2", 200, (body) => body.id === 2],
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
      ["should return error for invalid ID (0)", "/subject/0", 400],
      ["should return error for invalid ID (-1)", "/subject/-1", 400],
      ["should return error for non-numeric ID", "/subject/a", 400],
      ["should return error for non-existent ID", "/subjectw/9999", 404],
    ])(
      "%s",
      async (description, route, expectedStatus) => {
        const response = await request(app).get(route);
  
        expect(response.status).toBe(expectedStatus);
      }
    );
  });
  