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
import router from "../../routes/V1/collectionRoutes";
import { generateToken } from "../../services/jwtService";

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

const app = express();
app.use(express.json());
app.use("/collection", router);

const user1Token = generateToken({ name: "user1", email: "user1@example.com" });
const user2Token = generateToken({ name: "user2", email: "user2@example.com" });

/** Positive tests **/
describe("Collection Routes - Positive Tests", () => {
  describe("Create Collection", () => {
    test.each([
      [
        "should create a collection for user1",
        { name: "New Collection" },
        user1Token,
        201,
      ],
    ])("%s", async (description, payload, token, expectedStatus) => {
      const response = await request(app)
        .post("/collection")
        .set("Authorization", `Bearer ${token}`)
        .send(payload);

      expect(response.status).toBe(expectedStatus);
      expect(response.body).toHaveProperty("name", payload.name);
    });
  });

  describe("Get Collections", () => {
    test.each([["should retrieve collections for user1", user1Token, 200]])(
      "%s",
      async (description, token, expectedStatus) => {
        const response = await request(app)
          .get("/collection")
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(expectedStatus);
        expect(Array.isArray(response.body)).toBe(true);
      }
    );
  });

  describe("Update Collection", () => {
    test.each([
      [
        "should update collection for user1",
        { name: "Updated Collection" },
        user1Token,
        200,
      ],
    ])("%s", async (description, payload, token, expectedStatus) => {
      const response = await request(app)
        .put("/collection/1")
        .set("Authorization", `Bearer ${token}`)
        .send(payload);

      expect(response.status).toBe(expectedStatus);
      expect(response.body).toHaveProperty(
        "message",
        "Collection updated successfully"
      );
    });
  });

  describe("Delete Collection", () => {
    test.each([["should delete collection for user1", user1Token, 200]])(
      "%s",
      async (description, token, expectedStatus) => {
        const response = await request(app)
          .delete("/collection/1")
          .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(expectedStatus);
        expect(response.body).toHaveProperty(
          "message",
          "Collection deleted successfully"
        );
      }
    );
  });

  describe("Add Book to Collection", () => {
    test.each([
      [
        "should add a book to collection for user1",
        { collectionId: 1, bookId: 1 },
        user1Token,
        201,
      ],
    ])("%s", async (description, payload, token, expectedStatus) => {
      const response = await request(app)
        .post("/collection/addBook")
        .set("Authorization", `Bearer ${token}`)
        .send(payload);

      expect(response.status).toBe(expectedStatus);
      expect(response.body).toHaveProperty(
        "message",
        "Book added to collection successfully"
      );
    });
  });

  describe("Remove Book from Collection", () => {
    test.each([
      [
        "should remove a book from collection for user1",
        { collectionId: 1, bookId: 1 },
        user1Token,
        200,
      ],
    ])("%s", async (description, payload, token, expectedStatus) => {
      const response = await request(app)
        .delete("/collection/removeBook")
        .set("Authorization", `Bearer ${token}`)
        .send(payload);

      expect(response.status).toBe(expectedStatus);
      expect(response.body).toHaveProperty(
        "message",
        "Book removed from collection successfully"
      );
    });
  });
});

/** Negative tests **/
describe("Collection Routes - Negative Tests", () => {
  describe("Create Collection", () => {
    test.each([
      ["should fail to create collection without a name", {}, user1Token, 400],
      [
        "should fail to create collection for unauthenticated user",
        { name: "Invalid" },
        "",
        401,
      ],
    ])("%s", async (description, payload, token, expectedStatus) => {
      const response = await request(app)
        .post("/collection")
        .set("Authorization", token ? `Bearer ${token}` : "")
        .send(payload);

      expect(response.status).toBe(expectedStatus);
    });
  });

  describe("Update Collection", () => {
    test.each([
      [
        "should fail to update collection for unauthorized user",
        { name: "Invalid Update" },
        user2Token,
        403,
      ],
      ["should fail to update collection without a name", {}, user1Token, 400],
    ])("%s", async (description, payload, token, expectedStatus) => {
      const response = await request(app)
        .put("/collection/1")
        .set("Authorization", `Bearer ${token}`)
        .send(payload);

      expect(response.status).toBe(expectedStatus);
    });
  });

  describe("Delete Collection", () => {
    test.each([
      [
        "should fail to delete collection for unauthorized user",
        user2Token,
        403,
      ],
    ])("%s", async (description, token, expectedStatus) => {
      const response = await request(app)
        .delete("/collection/1")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(expectedStatus);
    });
  });

  describe("Add Book to Collection", () => {
    test.each([
      [
        "should fail to add a book to collection with invalid collectionId",
        { collectionId: "abc", bookId: 1 },
        user1Token,
        400,
      ],
      [
        "should fail to add a book to collection for unauthorized user",
        { collectionId: 1, bookId: 1 },
        "",
        401,
      ],
    ])("%s", async (description, payload, token, expectedStatus) => {
      const response = await request(app)
        .post("/collection/addBook")
        .set("Authorization", token ? `Bearer ${token}` : "")
        .send(payload);

      expect(response.status).toBe(expectedStatus);
    });
  });

  describe("Remove Book from Collection", () => {
    test.each([
      [
        "should fail to remove a book from collection with invalid bookId",
        { collectionId: 1, bookId: "abc" },
        user1Token,
        400,
      ],
      [
        "should fail to remove a book from collection for unauthorized user",
        { collectionId: 1, bookId: 1 },
        "",
        401,
      ],
    ])("%s", async (description, payload, token, expectedStatus) => {
      const response = await request(app)
        .delete("/collection/removeBook")
        .set("Authorization", token ? `Bearer ${token}` : "")
        .send(payload);

      expect(response.status).toBe(expectedStatus);
    });
  });
});
