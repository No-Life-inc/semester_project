// import { afterAll, beforeAll, afterEach, describe, expect, it, jest } from "@jest/globals";

// jest.setTimeout(120000);

// import { setupTestDB, teardownTestDB } from "./setupTestDB";
// import {
//   createCollection,
//   getUserCollections,
//   updateCollection,
//   deleteCollection,
// } from "../../services/collectionService";

// beforeAll(async () => {
//   await setupTestDB();
// });

// afterAll(async () => {
//   await teardownTestDB();
// });

// describe("Collection Service Tests", () => {
//   describe("Positive Tests", () => {
//     it("should create a collection for a valid user", async () => {
//       const collection = await createCollection("Test Collection", 1);
//       expect(collection).toBeDefined();
//       expect(collection.name).toBe("Test Collection");
//     });

//     it("should fetch collections for a valid user", async () => {
//       const collections = await getUserCollections(1);
//       expect(Array.isArray(collections)).toBe(true);
//       expect(collections?.length).toBeGreaterThanOrEqual(0);
//     });

//     it("should update a collection with a valid id", async () => {
//       const collection = await createCollection("Initial Collection", 1);

//       await updateCollection(collection.id, "Updated Collection Name");
//       const collections = await getUserCollections(1);

//       expect(
//         collections?.find((col) => col.name === "Updated Collection Name")
//       ).toBeDefined();
//     });

//     it("should delete a collection for a valid user and collection id", async () => {
//       const collection = await createCollection("Collection to Delete", 1);
//       await deleteCollection(collection.id, 1);

//       const collections = await getUserCollections(1);
//       expect(
//         collections?.find((col) => col.id === collection.id)
//       ).toBeUndefined();
//     });
//   });

//   describe("Negative Tests", () => {
//     it("should throw an error if the user does not exist when creating a collection", async () => {
//       await expect(
//         createCollection("Invalid User Collection", 999)
//       ).rejects.toThrow("User not found");
//     });

//     it("should throw an error if the user does not exist when fetching collections", async () => {
//       await expect(getUserCollections(999)).rejects.toThrow("User not found");
//     });

//     it("should throw an error if the collection does not exist when updating", async () => {
//       await expect(
//         updateCollection(999, "Nonexistent Collection")
//       ).rejects.toThrow("Collection not found");
//     });

//     it("should throw an error if the user does not own the collection when deleting", async () => {
//       const collection = await createCollection("Unauthorized Collection", 1);
//       await expect(deleteCollection(collection.id, 2)).rejects.toThrow(
//         "Unauthorized to delete this collection"
//       );
//     });

//     it("should throw an error if the collection does not exist when deleting", async () => {
//       await expect(deleteCollection(999, 1)).rejects.toThrow(
//         "Collection not found"
//       );
//     });

//     it("should throw an error when creating a collection without a name", async () => {
//       await expect(createCollection("", 1)).rejects.toThrow(
//         "Validation error: Validation notEmpty on name failed"
//       );
//     });

//     it("should throw an error if collection name is null during creation", async () => {
//       await expect(createCollection(null, 1)).rejects.toThrow(
//         "Name cannot be null"
//       );
//     });

//     it("should throw an error if updating a collection without a name", async () => {
//       const collection = await createCollection("Temporary Collection", 1);
//       await expect(updateCollection(collection.id, "")).rejects.toThrow(
//         "Validation error: Validation notEmpty on name failed"
//       );
//     });

//     it("should throw an error if user ID is missing when deleting a collection", async () => {
//       const collection = await createCollection("No User Collection", 1);
//       await expect(deleteCollection(collection.id, null)).rejects.toThrow(
//         "Invalid user ID"
//       );
//     });

//     it("should throw an error for invalid user ID format in deleteCollection", async () => {
//       const collection = await createCollection("Invalid UserID Collection", 1);
//       await expect(
//         deleteCollection(collection.id, "invalid_id" as any)
//       ).rejects.toThrow("Invalid user ID");
//     });

//     it("should throw an error if trying to delete a non-existent collection", async () => {
//       await expect(deleteCollection(999, 1)).rejects.toThrow(
//         "Collection not found"
//       );
//     });
//   });
// });


import { afterAll, beforeAll, describe, expect, jest, test } from "@jest/globals";

jest.setTimeout(120000); 

import { setupTestDB, teardownTestDB } from "./setupTestDB";
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
      expect(deleted).toBe(1);
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
  [1, 2, 3],
  [2, 1, 2],
];

describe("addBookToCollection function positive tests", () => {
  test.each(addBookToCollectionPositiveCases)(
    "should add a book to a collection (userId: %i, collectionId: %i, bookId: %i)",
    async (userId: number, collectionId: number, bookId: number) => {

      await expect(addBookToCollection(userId, collectionId, bookId)).resolves.not.toThrow();
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