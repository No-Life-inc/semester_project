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
import { userSetup, getUserToken, teardownUserSetup } from "../utility/userSetup";
import {bookSetup, getBookId, teardownBookSetup} from "../utility/bookSetup"
import router from "../../routes/V1/userBookRoutes";

beforeAll(async () => {
await setupTestDB();
await userSetup();
await bookSetup();
});

afterAll(async () => {
await teardownUserSetup();
await teardownBookSetup();
await teardownTestDB();
});

const app = express();

// Setup middleware
app.use(express.json());
app.use('/userBook', router);

describe('UserBook Routes - Get UserBooks Positive tests', () => {
    test.each([
        ["should get 1 userBooks", "/userBook/", 200, Array.isArray, 1],
        ["should get 1 userBook", "/userBook/?limit=1", 200, Array.isArray, 1],
        ["should get 1 userBooks", "/userBook/?limit=2", 200, Array.isArray, 1],
        ["should get 1 userBooks on page 1", "/userBook/?limit=99", 200, Array.isArray, 1],
        ["should get 1 userBooks on page 1", "/userBook/?limit=100", 200, Array.isArray, 1],
        ["should get default 1 userBooks on page 1", "/userBook/?page=1", 200, Array.isArray, 1],
        ["should get default 0 userBooks on page 2", "/userBook/?page=2", 200, Array.isArray, 0],
    ])(
        "%s", // Use the description for each test
        async (description, route, expectedStatus, expectedBodyType, expectedLength) => {
            const response = await request(app)
                .get(route)
                .set('Authorization', `Bearer ${getUserToken(1)}`); 

            // Check the response status
            expect(response.status).toBe(expectedStatus);

            // Check the response body is an array
            expect(expectedBodyType(response.body)).toBe(true);

            // Check the number of userBooks
            expect(response.body.length).toBe(expectedLength);
        }
    );
});

describe('UserBook Routes - Get UserBooks Negative tests', () => {
    test.each([
        ["should return 400 for invalid user id", "/userBook/0", 404],
        ["should return 400 for invalid page number", "/userBook/1?page=0", 404],
        ["should return 400 for invalid limit", "/userBook/1?limit=0", 404],
        ["should return 400 for invalid limit", "/userBook/1?limit=101", 404],
    ])(
        "%s", // Use the description for each test
        async (description, route, expectedStatus) => {
            const response = await request(app)
                .get(route)
                .set('Authorization', `Bearer ${getUserToken(1)}`); 

            // Check the response status
            expect(response.status).toBe(expectedStatus);
        }
    );
});

describe("UserBook Routes - Add Book to User Positive Tests", () => {

    test.each([
      [
        "should successfully add book to user",
        1,
        1,
        201, 
      ],
      [
        "should successfully add another book to user",
        2,
        1,
        201, 
      ],
      [
        "should add book for a different user",
        47,
        2,
        201,
      ],
    ])(
      "%s", // Use the description for each test
      async (description, bookIndex, tokenIndex, expectedStatus) => {

        const payload = {
          bookId: getBookId(bookIndex),
        };

        const token = getUserToken(tokenIndex);

        const response = await request(app)
          .post("/userBook")
          .set("Authorization", `Bearer ${token}`)
          .send(payload);

        // Check the response status
        expect(response.status).toBe(expectedStatus);
        
        // Optionally check the response body for the correct structure
        expect(response.body).toHaveProperty("id");
        expect(response.body.bookId).toBe(payload.bookId);
      }
    );
  });


describe("UserBook Routes - Add Book to User Negative Tests", () => {
    test.each([
      [
        "should return 400 when book does not exist",
        { bookId: 9999 },
        400,
        1,
      ],
      [
        "should return 400 when bookId is 0",
        { bookId: 0 },
        400,
        1,
      ],
      [
        "should return 400 when bookId is -1",
        { bookId: -1 },
        400,
        1,
      ],
      [
        "should return 400 when bookId is NaN",
        { bookId: NaN },
        400,
        1,
      ],
      [
        "should return 400 when bookId is invalid",
        { bookId: "invalid" },
        400,
        1,
      ],
      [
        "missing jwt token",
        { bookId: 20 },
        401,
        50,
      ],
    ])(
      "%s", // Use the description for each test
      async (description, payload, expectedStatus, tokenIndex) => {

        const token = getUserToken(tokenIndex);

        const response = await request(app)
          .post("/userBook")
          .set("Authorization", `Bearer ${token}`)
          .send(payload);
  
        // Check the response status
        expect(response.status).toBe(expectedStatus);
      }
    );
  });
