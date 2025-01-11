import {
  afterAll, beforeAll, describe, expect, jest, test,
} from "@jest/globals";

jest.setTimeout(120000);

import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";
import knex from "knex";
import knexConfig from "../../knexfile";
import {createCollection, getUserCollections, updateCollection, deleteCollection, addBookToCollection, removeBookFromCollection} from "../../services/collectionService";
import {ValidationError, NotFoundError, UnauthorizedError, ForbiddenError} from "../../utility/errors";
import UserBook from "../../models/sequelize/UserBook";
import User from "../../models/sequelize/User";
import UserBookCollection from "../../models/sequelize/UserBookCollection";
import Collection from "../../models/sequelize/Collection";

const testKnex = knex(knexConfig.test);

beforeAll(async ()=>{
  await setupTestDB();
});

afterAll(async ()=>{
  await teardownTestDB();
});

// Create Collection Positive Tests
const createCollectionPositiveCases = [
  ["Collection 1", "test_email@example.com"],
  ["Collection 2", "test_password@example.com"],
  ["Collection 3", "test@test.com"],
];

describe("createCollection function positive tests", () => {
  test.each(createCollectionPositiveCases)(
    "should create a collection (name: %s, email: %s)",
    async (name, email) => {
      const collection = await createCollection(name, email);
      expect(collection).toBeDefined();
      expect(collection.name).toBe(name);
    }
  );
});

// Create Collection Negative Tests
type CreateCollectionNegativeTestCase = [
  string | null | undefined,
  string,
  typeof ValidationError | typeof NotFoundError,
  string
];

const createCollectionNegativeCases: CreateCollectionNegativeTestCase[] = [
  ["", "test_email@example.com", ValidationError, "Collection name is required"],
  [null, "test_email@example.com", ValidationError, "Collection name is required"],
  [undefined, "test_email@example.com", ValidationError, "Collection name is required"],
  [" ", "test_email@example.com", ValidationError, "Collection name is required"],
  ["0", "test_email@example.com", ValidationError, "Collection name cannot be a number"],
  ["A".repeat(256), "test_email@example.com", ValidationError, "Collection name must be between 1 and 255 characters"],
  ["A".repeat(254), "test_email@example.com", ValidationError, "Collection name must be between 1 and 255 characters"],
  ["A".repeat(255), "test_email@example.com", ValidationError, "Collection name must be between 1 and 255 characters"],
  ["-1", "test_email@example.com", ValidationError, "Collection name cannot be a number"],
  ["Invalid Collection", "invalid@example.com", NotFoundError, "User not found"],
];

describe("createCollection function negative tests", () => {
  test.each(createCollectionNegativeCases)(
    "should throw an error (name: %s, email: %s, errorClass: %s, errorMessage: %s)",
    async (name, email, errorClass, errorMessage) => {
      await expect(createCollection(name as any, email)).rejects.toThrow(errorClass);
      await expect(createCollection(name as any, email)).rejects.toThrow(errorMessage);
    }
  );
});

// Get User Collection Positive Tests
type GetUserCollectionsPositiveTestCase = [string, number];

const getUserCollectionsPositiveCases: GetUserCollectionsPositiveTestCase[] = [
  ["test_email@example.com", 1],
  ["test_password@example.com", 1],
  ["test@test.com", 1],
];

describe("getUserCollections function positive tests", () => {
  test.each(getUserCollectionsPositiveCases)(
    "should fetch collections for user (email: %s)",
    async (email, expectedCollectionCount) => {
      const collections = await getUserCollections(email);
      expect(collections).toBeDefined();
      expect(Array.isArray(collections)).toBe(true);
      expect(collections.length).toBe(expectedCollectionCount);

      if (expectedCollectionCount > 0) {
        collections.forEach((collection) => {
          expect(collection).toHaveProperty("name");
          expect(collection).toHaveProperty("user_books");
        });
      }
    }
  );
});

// Get User Collection Negative Tests
type GetUserCollectionsNegativeTestCase = [
  string | null | undefined,
  typeof ValidationError | typeof NotFoundError,
  string
];

const getUserCollectionsNegativeCases: GetUserCollectionsNegativeTestCase[] = [
  ["", ValidationError, "Invalid email address"],
  [null, ValidationError, "Invalid email address"],
  [undefined, ValidationError, "Invalid email address"],
  [" ", ValidationError, "Invalid email address"],
  ["non_existent@example.com", NotFoundError, "User not found"],
];

describe("getUserCollections function negative tests", () => {
  test.each(getUserCollectionsNegativeCases)(
    "should throw an error for invalid user input (email: %s, errorClass: %s, errorMessage: %s)",
    async (email: string | null | undefined, errorClass: typeof NotFoundError, errorMessage: string) => {
      await expect(getUserCollections(email as any)).rejects.toThrow(errorClass);
      await expect(getUserCollections(email as any)).rejects.toThrow(errorMessage);
    }
  );
});

// Update Collection Positive Tests
type UpdateCollectionPositiveTestCase = [number, string, string];

const updateCollectionPositiveCases: UpdateCollectionPositiveTestCase[] = [
  [1, "Updated Collection Name", "test_email@example.com"],
  [2, "Another Valid Name", "test_password@example.com"],
];

describe("updateCollection function positive tests", () => {
  test.each(updateCollectionPositiveCases)(
    "should update collection (id: %d, name: %s, email: %s)",
    async (id, name, email) => {
      const updatedCollection = await updateCollection(id, name, email);
      expect(updatedCollection).toBeDefined();
      expect(updatedCollection.name).toBe(name);
    }
  );
});

// Update Collection Negative Tests
type UpdateCollectionNegativeTestCase = [
  number,
  string | null | undefined,
  typeof NotFoundError | typeof ValidationError | typeof ForbiddenError,
  string,
  string
];

const updateCollectionNegativeCases: UpdateCollectionNegativeTestCase[] = [
  [999, "Non-existent Collection", NotFoundError, "Collection not found", "test_email@example.com"],
  [1, "", ValidationError, "Collection name cannot be empty or whitespace", "test_email@example.com"],
  [1, null, ValidationError, "Collection name cannot be empty or whitespace", "test_email@example.com"],
  [1, undefined, ValidationError, "Collection name cannot be empty or whitespace", "test_email@example.com"],
  [1, " ".repeat(10), ValidationError, "Collection name cannot be empty or whitespace", "test_email@example.com"],
  [1, "A".repeat(256), ValidationError, "Collection name must be between 1 and 255 characters", "test_email@example.com"],
  [1, "12345", ValidationError, "Collection name cannot be a number", "test_email@example.com"],
  [1, "Updated Name", ForbiddenError, "You are not authorized to update this collection", "test@test.com"],
];

describe("updateCollection function negative tests", () => {
  test.each(updateCollectionNegativeCases)(
    "should throw an error for invalid update (id: %d, name: %s, errorClass: %s, errorMessage: %s)",
    async (
      id: number,
      name: string | null | undefined,
      errorClass: typeof NotFoundError | typeof ValidationError | typeof ForbiddenError,
      errorMessage: string,
      email: string
    ) => {
      await expect(updateCollection(id, name as string, email)).rejects.toThrow(errorClass);
      await expect(updateCollection(id, name as string, email)).rejects.toThrow(errorMessage);
    }
  );
});

// Delete Collection Positive Tests
type DeleteCollectionPositiveTestCase = [number, string];

const deleteCollectionPositiveCases: DeleteCollectionPositiveTestCase[] = [
  [1, "test_email@example.com"],
  [2, "test_password@example.com"],
];

describe("deleteCollection function positive tests", () => {
  test.each(deleteCollectionPositiveCases)(
    "should delete collection (id: %d, email: %s)",
    async (id, email) => {
      const result = await deleteCollection(id, email);
      expect(result).toBe(true);

      const collectionExists = await Collection.findByPk(id);
      expect(collectionExists).toBeNull();
    }
  );
});

// Delete Collection Negative Tests
type DeleteCollectionNegativeTestCase = [
  number | null | undefined | string,
  string | null | undefined,
  typeof NotFoundError | typeof ForbiddenError | typeof ValidationError,
  string
];

const deleteCollectionNegativeCases: DeleteCollectionNegativeTestCase[] = [
  [999, "test_email@example.com", NotFoundError, "Collection not found"],
  [1, "non_existent_user@example.com", NotFoundError, "User not found"],
  [3, "test_email@example.com", ForbiddenError, "You are not authorized to delete this collection"],
  [0, "test_email@example.com", ValidationError, "Invalid collection ID"],
  [-1, "test_email@example.com", ValidationError, "Invalid collection ID"],
  [-999, "test_email@example.com", ValidationError, "Invalid collection ID"],
  [NaN, "test_email@example.com", ValidationError, "Invalid collection ID"],
  [null, "test_email@example.com", ValidationError, "Invalid collection ID"],
  [undefined, "test_email@example.com", ValidationError, "Invalid collection ID"],
  [1, "", ValidationError, "Invalid email address"],
  [1, null, ValidationError, "Invalid email address"],
  [1, undefined, ValidationError, "Invalid email address"],
  [1, "  ", ValidationError, "Invalid email address"],
];

describe("deleteCollection function negative tests", () => {
  test.each(deleteCollectionNegativeCases)(
    "should throw an error for invalid delete (id: %s, email: %s, errorClass: %s, errorMessage: %s)",
    async (
      id: number | null | undefined | string,
      email: string | null | undefined,
      errorClass: typeof NotFoundError | typeof ForbiddenError | typeof ValidationError,
      errorMessage: string
    ) => {
      await expect(deleteCollection(id as number, email as string)).rejects.toThrow(errorClass);
      await expect(deleteCollection(id as number, email as string)).rejects.toThrow(errorMessage);
    }
  );
});


//addBookToCollection positive test cases
describe("addBookToCollection function positive tests", () => {
  test.each([
    ["test_email@example.com", "Collection 1", 1],
    ["test_password@example.com", "Collection 2", 2],
    ["test@test.com", "Collection 3", 3],
  ])(
    "should add a book to a collection (email: %s, collectionName: %s, bookId: %i)",
    async (email, collectionName, bookId) => {

      const user = await User.findOne({ where: { email } });
      expect(user).toBeDefined();

      const collection = await Collection.create({
        name: collectionName,
        userId: user!.id,
      });

      const userBook = await UserBook.findOne({
        where: { user_id: user!.id, book_id: bookId },
      }) || await UserBook.create({
        user_id: user!.id,
        book_id: bookId,
      });
      expect(userBook).toBeDefined();

      await UserBookCollection.destroy({
        where: { collection_id: collection.id, user_book_id: userBook!.id },
      });

      await expect(
        addBookToCollection(email, collection.id, bookId)
      ).resolves.not.toThrow();

      const addedEntry = await UserBookCollection.findOne({
        where: { collection_id: collection.id, user_book_id: userBook!.id },
      });
      expect(addedEntry).toBeDefined();
    }
  );
});

// Negative test cases for addBookToCollection
describe("addBookToCollection function negative tests", () => {
  test.each([
    ["non_existent_user@example.com", 1, 1, NotFoundError, "User not found"],
    ["test_email@example.com", 999, 1, NotFoundError, "Collection not found"],
    ["test_email@example.com", 3, 1, UnauthorizedError, "You are not authorized to add a book to this collection"],
    ["test@test.com", 3, 3, ValidationError, "Book already exists in the collection"],
  ])(
    "should throw an error (email: %s, collectionId: %i, bookId: %i, errorClass: %s, errorMessage: %s)",
    async (
      email: string,
      collectionId: number,
      bookId: number,
      errorClass: typeof NotFoundError | typeof ValidationError | typeof UnauthorizedError,
      errorMessage: string
    ) => {
      await expect(
        addBookToCollection(email, collectionId, bookId)
      ).rejects.toThrow(errorClass);
      await expect(
        addBookToCollection(email, collectionId, bookId)
      ).rejects.toThrow(errorMessage);
    }
  );
});

type RemoveBookFromCollectionTestCase = [string, number, number];

const removeBookFromCollectionPositiveCases: RemoveBookFromCollectionTestCase[] = [
  ["test@test.com", 3, 3],
];

describe("removeBookFromCollection function positive tests", () => {
  test.each(removeBookFromCollectionPositiveCases)(
    "should remove a book from a collection (email: %s, collectionId: %i, bookId: %i)",
    async (email, collectionId, bookId) => {
      const user = await User.findOne({ where: { email } });
      const userBook = await UserBook.findOne({
        where: { user_id: user!.id, book_id: bookId },
      });

      expect(userBook).toBeDefined();

      const collectionEntry = await UserBookCollection.findOne({
        where: { collection_id: collectionId, user_book_id: userBook!.id },
      });

      expect(collectionEntry).toBeDefined();

      await expect(
        removeBookFromCollection(email, collectionId, bookId)
      ).resolves.not.toThrow();

      const removedEntry = await UserBookCollection.findOne({
        where: { collection_id: collectionId, user_book_id: userBook!.id },
      });

      expect(removedEntry).toBeNull();
    }
  );
});

type RemoveBookFromCollectionNegativeTestCase = [
  string,
  number,
  number,
  typeof NotFoundError | typeof UnauthorizedError,
  string
];

const removeBookFromCollectionNegativeCases: RemoveBookFromCollectionNegativeTestCase[] = [
  ["non_existent_user@example.com", 1, 1, NotFoundError, "User not found"],
  ["test_email@example.com", 999, 1, NotFoundError, "Collection not found"],
  ["test_email@example.com", 3, 1, ForbiddenError, "You are not authorized to remove a book from this collection"],
  ["test@test.com", 3, 999, NotFoundError, "UserBook entry not found"],
];

describe("removeBookFromCollection function negative tests", () => {
  test.each(removeBookFromCollectionNegativeCases)(
    "should throw an error (email: %s, collectionId: %i, bookId: %i, errorClass: %s, errorMessage: %s)",
    async (
      email: string,
      collectionId: number,
      bookId: number,
      errorClass: typeof NotFoundError | typeof UnauthorizedError,
      errorMessage: string
    ) => {
      await expect(
        removeBookFromCollection(email, collectionId, bookId)
      ).rejects.toThrow(errorClass);
      await expect(
        removeBookFromCollection(email, collectionId, bookId)
      ).rejects.toThrow(errorMessage);
    }
  );
});


// Boundary Tests for Collection Name
const maxText = "A".repeat(255);
const maxTextMinusOne = "A".repeat(254);
const maxTextPlusOne = "A".repeat(256);

type NameBoundaryTestCase = [
  string,
  typeof ValidationError | null,
  string | null
];

const nameBoundaryCases: NameBoundaryTestCase[] = [
  ["", ValidationError, "Collection name is required"],
  ["A", null, null],
  [maxTextMinusOne, null, null],
  [maxTextPlusOne, ValidationError, "Collection name must be between 1 and 255 characters"],
  [maxText, null, null],
  ["Special!@#$%^&*()", null, null],
];

describe("Boundary tests for Collection name", () => {
  test.each(nameBoundaryCases)(
    "should handle name boundary cases (name: %s)",
    async (name: string, errorClass: typeof ValidationError | null, errorMessage: string | null) => {
      const email = "test@test.com";

      if (errorClass) {
        await expect(createCollection(name, email)).rejects.toThrow(errorClass);
        await expect(createCollection(name, email)).rejects.toThrow(errorMessage!);
      } else {
        const collection = await createCollection(name, email);
        expect(collection).toBeDefined();
        expect(collection.name).toBe(name);
      }
    }
  );
});

// Test for removing a book from an empty collection
describe("Remove book from an empty collection", () => {
  test("should throw an error when removing a book from an empty collection", async () => {
    const email = "test@test.com";
    const collection = await createCollection("Empty Collection", email);
    const bookId = 999; // Assume this book ID does not exist in the collection

    await expect(
      removeBookFromCollection(email, collection.id, bookId)
    ).rejects.toThrow(NotFoundError);
    await expect(
      removeBookFromCollection(email, collection.id, bookId)
    ).rejects.toThrow("UserBook entry not found");
  });
});

