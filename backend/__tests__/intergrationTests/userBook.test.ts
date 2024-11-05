jest.setTimeout(30000); // Sets timeout to 30 seconds

import { setupTestDB, teardownTestDB } from "./setupTestDB";
import knex from "knex";
import knexConfig from "../../knexfile";
import {addBookToUser} from "../../controllers/userBookController";


// Initialize Knex
const testKnex = knex(knexConfig.test);

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

describe("addBookToUser function positive tests", () => {
    it("should add a book to a user", async () => {
      const book = await addBookToUser(1, 1);
      expect(book).toBeDefined();
    });

    it("should add a book to a user", async () => {
        const book = await addBookToUser(2, 2);
        expect(book).toBeDefined();
      });

    it("should add a book to a user", async () => {
        const book = await addBookToUser(100, 3);
        expect(book).toBeDefined();
      });

    it("should add a book to a user", async () => {
        const book = await addBookToUser(99, 3);
        expect(book).toBeDefined();
      });
  });