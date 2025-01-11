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
        "%s", 
        async (description, route, expectedStatus, expectedBodyType, expectedLength) => {
            const response = await request(app)
                .get(route)
                .set('Authorization', `Bearer ${getUserToken(1)}`); 

           
            expect(response.status).toBe(expectedStatus);

            
            expect(expectedBodyType(response.body)).toBe(true);

           
            expect(response.body.length).toBe(expectedLength);
        }
    );
});

describe('UserBook Routes - Get UserBooks Negative tests', () => {
    test.each([
        ["should return 400 for invalid token", "/userBook", 50, 401],
        ["should return 400 for invalid page number", "/userBook?page=0", 1, 422],
        ["should return 400 for invalid page number", "/userBook?page=-1", 1, 422],
        ["should return 400 for invalid page number", "/userBook?page=-2", 1, 422],
        ["should return 400 for invalid limit", "/userBook?limit=0", 1, 422],
        ["should return 400 for invalid limit", "/userBook?limit=-1", 1, 422],
        ["should return 400 for invalid limit", "/userBook?limit=-2", 1, 422],
        ["should return 400 for invalid limit", "/userBook?limit=101", 1, 422],
        ["should return 400 for invalid limit", "/userBook?limit=102", 1, 422],
    ])(
        "%s", 
        async (description, route, tokenId, expectedStatus) => {
            const token = getUserToken(Number(tokenId));
            const response = await request(app)
                .get(route)
                .set('Authorization', `Bearer ${token}`); 

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
      "%s", 
      async (description, bookIndex, tokenIndex, expectedStatus) => {

        const payload = {
          bookId: getBookId(bookIndex),
        };

        const token = getUserToken(tokenIndex);

        const response = await request(app)
          .post("/userBook")
          .set("Authorization", `Bearer ${token}`)
          .send(payload);

        
        expect(response.status).toBe(expectedStatus);
        
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
        404,
        1,
      ],
      [
        "should return 400 when bookId is 0",
        { bookId: 0 },
        422,
        1,
      ],
      [
        "should return 400 when bookId is -1",
        { bookId: -1 },
        422,
        1,
      ],
      [
        "should return 400 when bookId is NaN",
        { bookId: NaN },
        422,
        1,
      ],
      [
        "should return 400 when bookId is invalid",
        { bookId: "invalid" },
        422,
        1,
      ],
      [
        "missing jwt token",
        { bookId: 20 },
        401,
        50,
      ],
    ])(
      "%s", 
      async (description, payload, expectedStatus, tokenIndex) => {

        const token = getUserToken(tokenIndex);

        const response = await request(app)
          .post("/userBook")
          .set("Authorization", `Bearer ${token}`)
          .send(payload);
  
        
        expect(response.status).toBe(expectedStatus);
      }
    );
  });

describe("UserBook Routes - Remove Book from User Positive Tests", () => {
    test.each([
      [
        "should successfully remove book from user",
        2,
        1,
        200,
      ],
    ])(
      "%s", 
      async (description, bookId, tokenIndex, expectedStatus) => {

        const token = getUserToken(tokenIndex);

        const response = await request(app)
          .delete(`/userBook/${bookId}`)
          .set("Authorization", `Bearer ${token}`);
  
        
        expect(response.status).toBe(expectedStatus);
      }
    );
  });

describe("UserBook Routes - Remove Book from User Negative Tests", () => {
    test.each([
      [
        "should return 400 when bookId is 0",
        0,
        422,
        1,
      ],
      [
        "should return 400 when bookId is -1",
        -1,
        422,
        1,
      ],
      [
        "should return 400 when bookId is -2",
        -2,
        422,
        1,
      ],
      [
        "should return 404 when bookId is 101",
        101,
        404,
        1,
      ],
      [
        "should return 404 when bookId is 102",
        102,
        404,
        1,
      ],
      [
        "should return 400 when bookId is NaN",
        NaN,
        422,
        1,
      ],
      [
        "should return 400 when bookId is invalid",
        "invalid",
        422,
        1,
      ],
      [
        "missing jwt token",
        20,
        401,
        50,
      ],
    ])(
      "%s", 
      async (description, bookId, expectedStatus, tokenIndex) => {

        const token = getUserToken(tokenIndex);

        const response = await request(app)
          .delete(`/userBook/${bookId}`)
          .set("Authorization", `Bearer ${token}`);
  
        
        expect(response.status).toBe(expectedStatus);

      });

  });