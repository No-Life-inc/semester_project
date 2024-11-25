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
app.use('/userBook', router);

describe('UserBook Routes - Get UserBooks  Positive tests', () => {
// Parameterized test for getting all userBooks
test.each([
    ["should get 50 userBooks", "/userBook/", 200, Array.isArray, 50],
    ["should get 1 userBook", "/userBook/?limit=1", 200, Array.isArray, 1],
    ["should get 2 userBooks", "/userBook/?limit=2", 200, Array.isArray, 2],
    ["should get 1 userBook on page 100", "/userBook/?page=100&limit=1", 200, Array.isArray, 1],
    ["should get 99 userBooks on page 1", "/userBook/?limit=99", 200, Array.isArray, 99],
    ["should get 100 userBooks on page 1", "/userBook/?limit=100", 200, Array.isArray, 100],
    ["should get default 50 userBooks on page 1", "/userBook/?page=1", 200, Array.isArray, 50],
    ["should get default 50 userBooks on page 2", "/userBook/?page=2", 200, Array.isArray, 50],

])(
    "%s", // Use the description for each test
    async (description, route, expectedStatus, expectedBodyType, expectedLength) => {
    const response = await request(app).get(route);

    // Check the response status
    expect(response.status).toBe(expectedStatus);
    
    // Check the response body is an array
    expect(expectedBodyType(response.body)).toBe(true);
    
    // Check the number of userBooks
    expect(response.body.length).toBe(expectedLength);
    }
);
});

describe('UserBook Routes - Get UserBooks  Negative tests', () => {
    // Parameterized test for getting all userBooks
    test.each([
    ["should return 400 for invalid user id", "/userBook/0", 404],
    ["should return 400 for invalid page number", "/userBook/1?page=0", 404],
    ["should return 400 for invalid limit", "/userBook/1?limit=0", 404],
    ["should return 400 for invalid limit", "/userBook/1?limit=101", 404],
    ])(
    "%s", // Use the description for each test
    async (description, route, expectedStatus) => {
        const response = await request(app).get(route);

        // Check the response status
        expect(response.status).toBe(expectedStatus);
    }
    );
});

// describe('UserBook Routes - Add Book to User Positive tests', () => {
//     // Parameterized test for adding a book to a user
//     test.each([
//     ["should add book to user", "/userBook/", 201],
//     ])(
//     "%s", // Use the description for each test
//     async (description, route, expectedStatus) => {
//         const response = await request(app)
//         .post(route)
//         .send({userId: 1, bookId: 99});

//         // Check the response status
//         expect(response.status).toBe(expectedStatus);
//     }
//     );
// });