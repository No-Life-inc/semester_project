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
import collectionRoutes from "../../routes/V1/collectionRoutes";
import {
  userSetup,
  teardownUserSetup,
  getUserToken,
} from "../utility/userSetup";

import * as CollectionService from "../../services/collectionService";

beforeAll(async () => {
  await setupTestDB();
  await userSetup();
});

afterAll(async () => {
  await teardownTestDB();
  await teardownUserSetup();
});

const app = express();

app.use(express.json());
app.use("/collections", collectionRoutes);

// Positive Tests for GET /collections
describe("Collection Routes - Get Collections Positive tests", () => {
  test.each([
    ["should fetch collections for User 1", () => getUserToken(0), 200, true],
    ["should fetch collections for User 2", () => getUserToken(1), 200, true],
    ["should fetch collections for User 3", () => getUserToken(2), 200, true],
  ])("%s", async (description, getTokenFn, expectedStatus, isArray) => {
    const token = getTokenFn();

    const response = await request(app)
      .get("/collections")
      .set("Authorization", token ? `Bearer ${token}` : "");

    expect(response.status).toBe(expectedStatus);

    if (isArray) {
      expect(Array.isArray(response.body)).toBe(true);
    }
  });
});

// Negative Tests for GET /collections
describe("Collection Routes - Get Collections Negative tests", () => {
  test.each([
    [
      "should return 401 for missing token",
      null,
      401,
      { message: "Token not provided" },
    ],
    [
      "should return 401 for invalid token",
      "invalidToken",
      401,
      { message: "Invalid or expired token" },
    ],
  ])("%s", async (description, token, expectedStatus, expectedBody) => {
    const response = await request(app)
      .get("/collections")
      .set("Authorization", token ? `Bearer ${token}` : "");

    expect(response.status).toBe(expectedStatus);

    if (expectedBody) {
      expect(response.body).toMatchObject(expectedBody);
    }
  });

  test("should return 500 for unexpected error", async () => {
    jest.spyOn(CollectionService, "getUserCollections").mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    const response = await request(app)
      .get("/collections")
      .set("Authorization", `Bearer ${getUserToken(0)}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "An error occurred" });

    jest.restoreAllMocks();
  });
});

// Positive Tests for POST /collections
describe("Collection Routes - POST /collections Positive Tests", () => {
  test.each([
    [
      "should create a collection with a valid name",
      { name: "Test Collection" },
      () => getUserToken(0),
      201,
    ],
    [
      "should create a collection with exactly 255 characters",
      { name: "a".repeat(255) },
      () => getUserToken(0),
      201,
    ],
    [
      "should create a collection with 1 character",
      { name: "a" },
      () => getUserToken(0),
      201,
    ]
  ])("%s", async (description, payload, getTokenFn, expectedStatus) => {
    const token = getTokenFn();
    const response = await request(app)
      .post("/collections")
      .set("Authorization", `Bearer ${token}`)
      .send(payload);

    expect(response.status).toBe(expectedStatus);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(payload.name);
  });
});

// Negative Tests for POST /collections
describe("Collection Routes - POST /collections Negative Tests", () => {
  test.each([
    [
      "should return 401 for missing token",
      { name: "Valid Name" },
      () => null,
      401,
      { message: "Token not provided" },
    ],
    [
      "should return 401 for invalid token",
      { name: "Valid Name" },
      () => "invalidToken",
      401,
      { message: "Invalid or expired token" },
    ],
    [
      "should return 422 for missing name field",
      {},
      () => getUserToken(0),
      422,
      { error: "Collection name is required" },
    ],
    [
      "should return 422 for null name",
      { name: null },
      () => getUserToken(0),
      422,
      { error: "Collection name is required" },
    ],
    [
      "should return 422 for empty string name",
      { name: "" },
      () => getUserToken(0),
      422,
      { error: "Collection name is required" },
    ],
    [
      "should return 422 for name exceeding 255 characters",
      { name: "A".repeat(256) },
      () => getUserToken(0),
      422,
      { message: "Collection name must be between 1 and 255 characters" },
    ],
  ])(
    "%s",
    async (description, payload, getTokenFn, expectedStatus, expectedBody) => {
      const token = getTokenFn();
      const response = await request(app)
        .post("/collections")
        .set("Authorization", token ? `Bearer ${token}` : "")
        .send(payload);

      expect(response.status).toBe(expectedStatus);
      if (expectedBody) {
        expect(response.body).toMatchObject(expectedBody);
      }
    }
  );

  test("should return 500 for unexpected error", async () => {
    jest.spyOn(CollectionService, "createCollection").mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    const response = await request(app)
      .post("/collections")
      .set("Authorization", `Bearer ${getUserToken(0)}`)
      .send({ name: "Valid Collection Name" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "An error occurred" });

    jest.restoreAllMocks();
  });
});

// Positive Tests for POST /addBook
describe("Collection Routes - POST /addBook Positive Tests", () => {
  test.each([
    [
      "should add a book to a collection",
      { collectionId: 1, bookId: 3 },
      () => getUserToken(0),
      201,
      { message: "Book added to collection successfully" },
    ],
    [
      "should add another book to a collection",
      { collectionId: 1, bookId: 2 },
      () => getUserToken(0),
      201,
      { message: "Book added to collection successfully" },
    ],
  ])(
    "%s",
    async (description, payload, getTokenFn, expectedStatus, expectedBody) => {
      const token = getTokenFn();
      const response = await request(app)
        .post("/collections/addBook")
        .set("Authorization", `Bearer ${token}`)
        .send(payload);

      expect(response.status).toBe(expectedStatus);
      expect(response.body).toMatchObject(expectedBody);
    }
  );
});

// Negative Tests for POST /addBook
describe("Collection Routes - POST /addBook Negative Tests", () => {
  test.each([
    [
      "should return 401 for missing token",
      { collectionId: 1, bookId: 3 },
      () => null,
      401,
      { message: "Token not provided" },
    ],
    [
      "should return 401 for invalid token",
      { collectionId: 1, bookId: 3 },
      () => "invalidToken",
      401,
      { message: "Invalid or expired token" },
    ],
    [
      "should return 400 for missing collectionId",
      { bookId: 3 },
      () => getUserToken(0),
      400,
      { error: "Collection ID is required" },
    ],
    [
      "should return 400 for missing bookId",
      { collectionId: 1 },
      () => getUserToken(0),
      400,
      { error: "Book ID is required" },
    ],
    [
      "should return 400 for invalid bookId (0)",
      { collectionId: 1, bookId: 0 },
      () => getUserToken(0),
      400,
      { error: "Book ID is required" },
    ],
    [
      "should return 422 for invalid bookId",
      { collectionId: 1, bookId: -1 },
      () => getUserToken(0),
      422,
      { error: "Invalid book ID" },
    ],
    [
      "should return 400 for invalid bookId",
      { collectionId: 1, bookId: NaN },
      () => getUserToken(0),
      400,
      { error: "Book ID is required" },
    ],
  ])(
    "%s",
    async (description, payload, getTokenFn, expectedStatus, expectedBody) => {
      const token = getTokenFn();
      const response = await request(app)
        .post("/collections/addBook")
        .set("Authorization", token ? `Bearer ${token}` : "")
        .send(payload);

      expect(response.status).toBe(expectedStatus);
      if (expectedBody) {
        expect(response.body).toMatchObject(expectedBody);
      }
    }
  );

  test("should return 500 for unexpected error", async () => {
    jest.spyOn(CollectionService, "addBookToCollection").mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    const response = await request(app)
      .post("/collections/addBook")
      .set("Authorization", `Bearer ${getUserToken(0)}`)
      .send({ collectionId: 1, bookId: 3 });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "An error occurred" });

    jest.restoreAllMocks();
  });
});

// Positive Tests for DELETE /removeBook
describe("Collection Routes - DELETE /removeBook Positive Tests", () => {
  test.each([
    [
      "should remove a book from a collection successfully",
      { collectionId: 1, bookId: 1 },
      () => getUserToken(0),
      200,
      { message: "Book removed from collection successfully" },
    ],
    [
      "should remove another book from a collection successfully",
      { collectionId: 1, bookId: 2 },
      () => getUserToken(0),
      200,
      { message: "Book removed from collection successfully" },
    ],
  ])(
    "%s",
    async (description, payload, getTokenFn, expectedStatus, expectedBody) => {
      const token = getTokenFn();
      const response = await request(app)
        .delete("/collections/removeBook")
        .set("Authorization", `Bearer ${token}`)
        .send(payload);

      expect(response.status).toBe(expectedStatus);
      expect(response.body).toMatchObject(expectedBody);
    }
  );
});

// Negative Tests for DELETE /removeBook
describe("Collection Routes - DELETE /removeBook Negative Tests", () => {
  test.each([
    [
      "should return 401 for missing token",
      { collectionId: 1, bookId: 1 },
      () => null,
      401,
      { message: "Token not provided" },
    ],
    [
      "should return 401 for invalid token",
      { collectionId: 1, bookId: 1 },
      () => "invalidToken",
      401,
      { message: "Invalid or expired token" },
    ],
    [
      "should return 403 for unauthorized user",
      { collectionId: 1, bookId: 1 },
      () => getUserToken(2),
      403,
      {
        error: "You are not authorized to remove a book from this collection",
      },
    ],
    [
      "should return 400 for 0 bookId ",
      { collectionId: 1, bookId: 0 },
      () => getUserToken(0),
      400,
      { error: "Book ID is required" },
    ],
    [
      "should return 422 for negative bookId",
      { collectionId: 1, bookId: -1 },
      () => getUserToken(0),
      422,
      { error: "Invalid book ID" },
    ],
    [
      "should return 400 for bookId = NaN",
      { collectionId: 1, bookId: NaN },
      () => getUserToken(0),
      400,
      { error: "Book ID is required" },
    ],
    [
      "should return 404 for non-existent bookId",
      { collectionId: 1, bookId: 999 },
      () => getUserToken(0),
      404,
      { error: "UserBook entry not found" },
    ],
  ])(
    "%s",
    async (description, payload, getTokenFn, expectedStatus, expectedBody) => {
      const token = getTokenFn();
      const response = await request(app)
        .delete("/collections/removeBook")
        .set("Authorization", token ? `Bearer ${token}` : "")
        .send(payload);

      expect(response.status).toBe(expectedStatus);
      if (expectedBody) {
        expect(response.body).toMatchObject(expectedBody);
      }
    }
  );

  test("should return 500 for unexpected error", async () => {
    jest.spyOn(CollectionService, "removeBookFromCollection").mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    const response = await request(app)
      .delete("/collections/removeBook")
      .set("Authorization", `Bearer ${getUserToken(0)}`)
      .send({ collectionId: 1, bookId: 3 });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "An error occurred" });

    jest.restoreAllMocks();
  });
});

// Positive Tests for PUT /collections/:id
describe("Collection Routes - PUT /collections/:id Positive Tests", () => {
  test.each([
    [
      "should update a collection successfully",
      1,
      { name: "Updated Collection Name" },
      () => getUserToken(0),
      200,
      { message: "Collection updated successfully" },
    ],
    [
      "should update another collection successfully",
      2,
      { name: "Another Updated Name" },
      () => getUserToken(1),
      200,
      { message: "Collection updated successfully" },
    ],
  ])(
    "%s",
    async (
      description,
      id,
      payload,
      getTokenFn,
      expectedStatus,
      expectedBody
    ) => {
      const token = getTokenFn();
      const response = await request(app)
        .put(`/collections/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(payload);

      expect(response.status).toBe(expectedStatus);
      expect(response.body).toMatchObject(expectedBody);
    }
  );
});

// Negative Tests for PUT /collections/:id
describe("Collection Routes - PUT /collections/:id Negative Tests", () => {
  test.each([
    [
      "should return 401 for missing token",
      1,
      { name: "Valid Name" },
      () => null,
      401,
      { message: "Token not provided" },
    ],
    [
      "should return 401 for invalid token",
      1,
      { name: "Valid Name" },
      () => "invalidToken",
      401,
      { message: "Invalid or expired token" },
    ],
    [
      "should return 403 for unauthorized user",
      1,
      { name: "Updated Name" },
      () => getUserToken(2),
      403,
      { error: "You are not authorized to update this collection" },
    ],
    [
      "should return 422 for id = 0",
      0,
      { name: "Valid Name" },
      () => getUserToken(0),
      422,
      { error: "Invalid collection ID" },
    ],
    [
      "should return 422 for id < 0",
      -1,
      { name: "Valid Name" },
      () => getUserToken(0),
      422,
      { error: "Invalid collection ID" },
    ],
    [
      "should return 422 for id = NaN",
      NaN,
      { name: "Valid Name" },
      () => getUserToken(0),
      422,
      { error: "Invalid collection ID" },
    ],
    [
      "should return 422 for missing name",
      1,
      {},
      () => getUserToken(0),
      422,
      { error: "Collection name is required" },
    ],
    [
      "should return 422 for empty string name",
      1,
      { name: "" },
      () => getUserToken(0),
      422,
      { error: "Collection name is required" },
    ],
    [
      "should return 422 for name exceeding 255 characters",
      1,
      { name: "A".repeat(256) },
      () => getUserToken(0),
      422,
      { error: "Collection name exceeds the maximum length of 255 characters" },
    ],
  ])(
    "%s",
    async (
      description,
      id,
      payload,
      getTokenFn,
      expectedStatus,
      expectedBody
    ) => {
      const token = getTokenFn();
      const response = await request(app)
        .put(`/collections/${id}`)
        .set("Authorization", token ? `Bearer ${token}` : "")
        .send(payload);

      expect(response.status).toBe(expectedStatus);
      if (expectedBody) {
        expect(response.body).toMatchObject(expectedBody);
      }
    }
  );

  test("should return 500 for unexpected error", async () => {
    jest.spyOn(CollectionService, "updateCollection").mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    const response = await request(app)
      .put("/collections/1")
      .set("Authorization", `Bearer ${getUserToken(0)}`)
      .send({ name: "Valid Name" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "An error occurred" });

    jest.restoreAllMocks();
  });
});

// Positive Tests for DELETE /collections/:id
describe("Collection Routes - DELETE /collections/:id Positive Tests", () => {
  test.each([
    [
      "should delete a valid collection for User 1",
      1,
      () => getUserToken(0),
      200,
      { message: "Collection deleted successfully" },
    ],
    [
      "should delete another valid collection for User 2",
      2,
      () => getUserToken(1),
      200,
      { message: "Collection deleted successfully" },
    ],
  ])(
    "%s",
    async (
      description,
      collectionId,
      getTokenFn,
      expectedStatus,
      expectedBody
    ) => {
      const token = getTokenFn();
      const response = await request(app)
        .delete(`/collections/${collectionId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(expectedStatus);
      if (expectedBody) {
        expect(response.body).toMatchObject(expectedBody);
      }
    }
  );
});

// Negative Tests for DELETE /collections/:id
describe("Collection Routes - DELETE /collections/:id Negative Tests", () => {
  test.each([
    [
      "should return 401 for missing token",
      1,
      () => null,
      401,
      { message: "Token not provided" },
    ],
    [
      "should return 401 for invalid token",
      1,
      () => "invalidToken",
      401,
      { message: "Invalid or expired token" },
    ],
    [
      "should return 422 for invalid ID = 0",
      0,
      () => getUserToken(0),
      422,
      { error: "Invalid collection ID" },
    ],
    [
      "should return 422 for invalid ID < 0",
      -1,
      () => getUserToken(0),
      422,
      { error: "Invalid collection ID" },
    ],
    [
      "should return 422 for invalid ID = NaN",
      NaN,
      () => getUserToken(0),
      422,
      { error: "Invalid collection ID" },
    ],
    [
      "should return 403 for unauthorized access to collection",
      3,
      () => getUserToken(1),
      403,
      { error: "You are not authorized to delete this collection" },
    ],
  ])(
    "%s",
    async (
      description,
      collectionId,
      getTokenFn,
      expectedStatus,
      expectedBody
    ) => {
      const token = getTokenFn();
      const response = await request(app)
        .delete(`/collections/${collectionId}`)
        .set("Authorization", token ? `Bearer ${token}` : "");

      expect(response.status).toBe(expectedStatus);
      if (expectedBody) {
        expect(response.body).toMatchObject(expectedBody);
      }
    }
  );

  test("should return 500 for unexpected error", async () => {
    jest.spyOn(CollectionService, "deleteCollection").mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    const response = await request(app)
      .delete("/collections/1")
      .set("Authorization", `Bearer ${getUserToken(0)}`);

    expect(response.status).toBe(500);
    expect(response.body).toMatchObject({ error: "An error occurred" });

    jest.restoreAllMocks();
  });
});
