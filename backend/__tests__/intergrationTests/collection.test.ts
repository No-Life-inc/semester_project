import { afterAll, beforeAll, describe, expect, jest, test } from "@jest/globals";

jest.setTimeout(120000); 

import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";
import knex from "knex";
import knexConfig from "../../knexfile";
import {
  createCollection,
  getUserCollections,
  updateCollection,
  deleteCollection,
  addBookToCollection,
  removeBookFromCollection,
} from "../../services/collectionService";
import UserBookCollection from "../../models/sequelize/UserBookCollection";
import UserBook from "../../models/sequelize/UserBook";

// Initialize Knex
const testKnex = knex(knexConfig.test);

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

// Positive test cases for createCollection
type CreateCollectionTestCase = [string, number];
const createCollectionPositiveCases: CreateCollectionTestCase[] = [
  ["New Collection 1", 1],
  ["Another Collection", 2],
  ["Sample Collection", 3],
];

describe("createCollection function positive tests", () => {
  test.each(createCollectionPositiveCases)(
    "should create a collection (name: %s, userId: %i)",
    async (name: string, userId: number) => {
      const collection = await createCollection(name, userId);
      expect(collection).toBeDefined();
      expect(collection.name).toBe(name);
    }
  );
});

// Negative test cases for createCollection
type CreateCollectionNegativeTestCase = [string | null, number, string];
const createCollectionNegativeCases: CreateCollectionNegativeTestCase[] = [
  ["Invalid User Collection", 999, "User not found"],
  ["", 1, "Validation error: Validation notEmpty on name failed"],
  [null, 1, "Name cannot be null"],
];

describe("createCollection function negative tests", () => {
  test.each(createCollectionNegativeCases)(
    "should throw an error (name: %s, userId: %i, errorMessage: %s)",
    async (name: string | null, userId: number, errorMessage: string) => {
      await expect(createCollection(name as string, userId)).rejects.toThrow(errorMessage);
    }
  );
});

// Positive test cases for getUserCollections
type GetUserCollectionsTestCase = [number];
const getUserCollectionsPositiveCases: GetUserCollectionsTestCase[] = [
  [1],
  [2],
  [3],
];

describe("getUserCollections function positive tests", () => {
  test.each(getUserCollectionsPositiveCases)(
    "should fetch collections for a valid user (userId: %i)",
    async (userId: number) => {
      const collections = await getUserCollections(userId);
      expect(Array.isArray(collections)).toBe(true);
    }
  );
});

// Negative test cases for getUserCollections
type GetUserCollectionsNegativeTestCase = [number, string];
const getUserCollectionsNegativeCases: GetUserCollectionsNegativeTestCase[] = [
  [999, "User not found"],
];

describe("getUserCollections function negative tests", () => {
  test.each(getUserCollectionsNegativeCases)(
    "should throw an error (userId: %i, errorMessage: %s)",
    async (userId: number, errorMessage: string) => {
      await expect(getUserCollections(userId)).rejects.toThrow(errorMessage);
    }
  );
});

// Positive test cases for updateCollection
type UpdateCollectionTestCase = [string, number];
const updateCollectionPositiveCases: UpdateCollectionTestCase[] = [
  ["Updated Collection Name", 1],
  ["Another Updated Name", 2],
];

describe("updateCollection function positive tests", () => {
  test.each(updateCollectionPositiveCases)(
    "should update a collection (name: %s, id: %i)",
    async (name: string, id: number) => {
      const collection = await createCollection("Temporary Collection", id);
      const updatedCollection = await updateCollection(collection.id, name);
      expect(updatedCollection).toBeDefined();
      expect(updatedCollection.name).toBe(name);
    }
  );
});

// Negative test cases for updateCollection
type UpdateCollectionNegativeTestCase = [number, string, string];
const updateCollectionNegativeCases: UpdateCollectionNegativeTestCase[] = [
  [999, "Nonexistent Collection", "Collection not found"],
  [1, "", "Validation error: Validation notEmpty on name failed"],
];

describe("updateCollection function negative tests", () => {
  test.each(updateCollectionNegativeCases)(
    "should throw an error (id: %i, name: %s, errorMessage: %s)",
    async (id: number, name: string, errorMessage: string) => {
      await expect(updateCollection(id, name)).rejects.toThrow(errorMessage);
    }
  );
});

// Positive test cases for deleteCollection
type DeleteCollectionTestCase = [string, number];
const deleteCollectionPositiveCases: DeleteCollectionTestCase[] = [
  ["Collection to Delete", 1],
];

describe("deleteCollection function positive tests", () => {
  test.each(deleteCollectionPositiveCases)(
    "should delete a collection (name: %s, userId: %i)",
    async (name: string, userId: number) => {
      const collection = await createCollection(name, userId);
      const deleted = await deleteCollection(collection.id, userId);
      expect(deleted).toEqual(expect.objectContaining({
        id: collection.id,
        name: "Collection to Delete",
        userId: collection.userId,
      }));
    }
  );
});

// Negative test cases for deleteCollection
type DeleteCollectionNegativeTestCase = [number, number | null, string];
const deleteCollectionNegativeCases: DeleteCollectionNegativeTestCase[] = [
  [999, 1, "Collection not found"],
  [1, 2, "Unauthorized to delete this collection"],
  [1, null, "Invalid user ID"],
  [1, NaN as any, "Invalid user ID"],
];

describe("deleteCollection function negative tests", () => {
  test.each(deleteCollectionNegativeCases)(
    "should throw an error (id: %i, userId: %i, errorMessage: %s)",
    async (id: number, userId: number | null, errorMessage: string) => {
      await expect(deleteCollection(id, userId as number)).rejects.toThrow(errorMessage);
    }
  );
});

// Positive test cases for addBookToCollection
type AddBookToCollectionTestCase = [number, number, number];
const addBookToCollectionPositiveCases: AddBookToCollectionTestCase[] = [
  [1, 1, 1], // Brug id'er som findes i seed-data
  [2, 2, 2],
];

describe("addBookToCollection function positive tests", () => {
  test.each(addBookToCollectionPositiveCases)(
    "should add a book to a collection (userId: %i, collectionId: %i, bookId: %i)",
    async (userId, collectionId, bookId) => {
      // Tjek først, om der findes en UserBook entry for den valgte bog og bruger
      const userBook = await UserBook.findOne({
        where: { user_id: userId, book_id: bookId },
      });
      expect(userBook).toBeDefined();

      // Sørg for at starte med en ren tilstand ved at fjerne den specifikke entry i UserBookCollection, hvis den eksisterer
      await UserBookCollection.destroy({
        where: { collection_id: collectionId, user_book_id: userBook!.id },
      });

      // Bekræft, at bogen ikke findes i kollektionen før testen
      const existingEntry = await UserBookCollection.findOne({
        where: { collection_id: collectionId, user_book_id: userBook!.id },
      });
      expect(existingEntry).toBeNull();

      // Test tilføjelse af bogen til kollektionen
      await expect(addBookToCollection(userId, collectionId, bookId)).resolves.not.toThrow();

      // Bekræft, at bogen nu er blevet tilføjet til kollektionen
      const addedEntry = await UserBookCollection.findOne({
        where: { collection_id: collectionId, user_book_id: userBook!.id },
      });
      expect(addedEntry).toBeDefined();
    }
  );
});

// Negative test cases for addBookToCollection
type AddBookToCollectionNegativeTestCase = [number, number, number, string];
const addBookToCollectionNegativeCases: AddBookToCollectionNegativeTestCase[] = [
  [1, 1, 999, "UserBook entry not found. Add the book to the user first."],
  [1, 1, 1, "Book already exists in the collection"],
];

describe("addBookToCollection function negative tests", () => {
  test.each(addBookToCollectionNegativeCases)(
    "should throw an error (userId: %i, collectionId: %i, bookId: %i, errorMessage: %s)",
    async (userId: number, collectionId: number, bookId: number, errorMessage: string) => {
      await expect(addBookToCollection(userId, collectionId, bookId)).rejects.toThrow(errorMessage);
    }
  );
});

// Positive test cases for removeBookFromCollection
type RemoveBookFromCollectionTestCase = [number, number, number];
const removeBookFromCollectionPositiveCases: RemoveBookFromCollectionTestCase[] = [
  [1, 1, 1],
  [2, 1, 2],
];

describe("removeBookFromCollection function positive tests", () => {
  test.each(removeBookFromCollectionPositiveCases)(
    "should remove a book from a collection (collectionId: %i, userId: %i, bookId: %i)",
    async (collectionId: number, userId: number, bookId: number) => {

      try {
        await addBookToCollection(userId, collectionId, bookId);
      } catch (error) {
        if (error.message !== "Book already exists in the collection") {
          throw error;
        }
      }


      await expect(removeBookFromCollection(collectionId, userId, bookId)).resolves.not.toThrow();
    }
  );
});

// Negative test cases for removeBookFromCollection
type RemoveBookFromCollectionNegativeTestCase = [number, number, number, string];
const removeBookFromCollectionNegativeCases: RemoveBookFromCollectionNegativeTestCase[] = [
  [999, 1, 1, "Collection not found"],
  [1, 1, 999, "UserBook entry not found"],
  [1, 1, 1, "Book not found in the collection"],
];

describe("removeBookFromCollection function negative tests", () => {
  test.each(removeBookFromCollectionNegativeCases)(
    "should throw an error (collectionId: %i, userId: %i, bookId: %i, errorMessage: %s)",
    async (collectionId: number, userId: number, bookId: number, errorMessage: string) => {
      await expect(removeBookFromCollection(collectionId, userId, bookId)).rejects.toThrow(errorMessage);
    }
  );
});