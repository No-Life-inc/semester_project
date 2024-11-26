import {
  afterAll,
  beforeAll,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

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
import User from "../../models/sequelize/User";
import {
  ValidationError,
  UnauthorizedError,
  NotFoundError,
} from "../../utility/errors";

// Initialize Knex
const testKnex = knex(knexConfig.test);

const user1Email = "test_email@example.com";
const user2Email = "test_password@example.com";
const user3Email = "test@test.com";

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

// Positive test cases for createCollection
type CreateCollectionTestCase = [string, string];
const createCollectionPositiveCases: CreateCollectionTestCase[] = [
  ["New Collection 1", user1Email],
  ["Another Collection", user2Email],
  ["Sample Collection", user3Email],
];

describe("createCollection function positive tests", () => {
  test.each(createCollectionPositiveCases)(
    "should create a collection (name: %s, email: %s)",
    async (name: string, email: string) => {
      const collection = await createCollection(name, email);
      expect(collection).toBeDefined();
      expect(collection.name).toBe(name);
    }
  );
});

// Negative test cases for createCollection
type CreateCollectionNegativeTestCase = [
  string | null,
  string,
  typeof NotFoundError | typeof ValidationError,
  string
];

const createCollectionNegativeCases: CreateCollectionNegativeTestCase[] = [
  [
    "Invalid User Collection",
    "invalid@example.com",
    NotFoundError,
    "User not found",
  ],
  ["", user1Email, ValidationError, "Collection name is required"],
  [null, user1Email, ValidationError, "Collection name is required"],
];

describe("createCollection function negative tests", () => {
  test.each(createCollectionNegativeCases)(
    "should throw an error (name: %s, email: %s, errorClass: %s, errorMessage: %s)",
    async (
      name: string | null,
      email: string,
      errorClass: typeof NotFoundError | typeof ValidationError,
      errorMessage: string
    ) => {
      await expect(createCollection(name as string, email)).rejects.toThrow(
        errorClass
      );
      await expect(createCollection(name as string, email)).rejects.toThrow(
        errorMessage
      );
    }
  );
});

// Positive test cases for getUserCollections
type GetUserCollectionsTestCase = [string];
const getUserCollectionsPositiveCases: GetUserCollectionsTestCase[] = [
  [user1Email],
  [user2Email],
  [user3Email],
];

describe("getUserCollections function positive tests", () => {
  test.each(getUserCollectionsPositiveCases)(
    "should fetch collections for a valid user (email: %s)",
    async (email: string) => {
      const collections = await getUserCollections(email);
      expect(Array.isArray(collections)).toBe(true);
    }
  );
});

// Negative test cases for getUserCollections
type GetUserCollectionsNegativeTestCase = [
  string,
  typeof NotFoundError,
  string
];

const getUserCollectionsNegativeCases: GetUserCollectionsNegativeTestCase[] = [
  ["invalid@example.com", NotFoundError, "User not found"],
];

describe("getUserCollections function negative tests", () => {
  test.each(getUserCollectionsNegativeCases)(
    "should throw an error (email: %s, errorClass: %s, errorMessage: %s)",
    async (
      email: string,
      errorClass: typeof NotFoundError,
      errorMessage: string
    ) => {
      await expect(getUserCollections(email)).rejects.toThrow(errorClass);
      await expect(getUserCollections(email)).rejects.toThrow(errorMessage);
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
      const collection = await createCollection(
        "Temporary Collection",
        user1Email
      );
      const updatedCollection = await updateCollection(collection.id, name);
      expect(updatedCollection).toBeDefined();
      expect(updatedCollection.name).toBe(name);
    }
  );
});

// Negative test cases for updateCollection
type UpdateCollectionNegativeTestCase = [
  number,
  string,
  typeof NotFoundError | typeof ValidationError,
  string
];

const updateCollectionNegativeCases: UpdateCollectionNegativeTestCase[] = [
  [999, "Nonexistent Collection", NotFoundError, "Collection not found"],
  [1, "", ValidationError, "Validation notEmpty on name failed"],
];

describe("updateCollection function negative tests", () => {
  test.each(updateCollectionNegativeCases)(
    "should throw an error (id: %i, name: %s, errorClass: %s, errorMessage: %s)",
    async (
      id: number,
      name: string,
      errorClass: typeof NotFoundError | typeof ValidationError,
      errorMessage: string
    ) => {
      await expect(updateCollection(id, name)).rejects.toThrow(errorClass);
      await expect(updateCollection(id, name)).rejects.toThrow(errorMessage);
    }
  );
});

// Positive test cases for deleteCollection
type DeleteCollectionTestCase = [string, string];
const deleteCollectionPositiveCases: DeleteCollectionTestCase[] = [
  ["Collection to Delete", user1Email],
];

describe("deleteCollection function positive tests", () => {
  test.each(deleteCollectionPositiveCases)(
    "should delete a collection (name: %s, email: %s)",
    async (name: string, email: string) => {
      const collection = await createCollection(name, email);
      const deleted = await deleteCollection(collection.id, email);
      expect(deleted).toBe(true);
    }
  );
});

// Negative test cases for deleteCollection
type DeleteCollectionNegativeTestCase = [
  number,
  string,
  typeof NotFoundError | typeof UnauthorizedError | typeof ValidationError,
  string
];

const deleteCollectionNegativeCases: DeleteCollectionNegativeTestCase[] = [
  [999, user1Email, NotFoundError, "Collection not found"],
  [
    1,
    user2Email,
    UnauthorizedError,
    "You are not authorized to delete this collection",
  ],
];

describe("deleteCollection function negative tests", () => {
  test.each(deleteCollectionNegativeCases)(
    "should throw an error (id: %i, email: %s, errorClass: %s, errorMessage: %s)",
    async (
      id: number,
      email: string,
      errorClass:
        | typeof NotFoundError
        | typeof UnauthorizedError
        | typeof ValidationError,
      errorMessage: string
    ) => {
      await expect(deleteCollection(id, email)).rejects.toThrow(errorClass);
      await expect(deleteCollection(id, email)).rejects.toThrow(errorMessage);
    }
  );
});

// Positive test cases for addBookToCollection
type AddBookToCollectionTestCase = [string, number, number];
const addBookToCollectionPositiveCases: AddBookToCollectionTestCase[] = [
  [user1Email, 1, 1],
  [user2Email, 2, 2],
  [user3Email, 3, 3],
];

describe("addBookToCollection function positive tests", () => {
  test.each(addBookToCollectionPositiveCases)(
    "should add a book to a collection (email: %s, collectionId: %i, bookId: %i)",
    async (email, collectionId, bookId) => {
      const user = await User.findOne({ where: { email } });
      const userBook = await UserBook.findOne({
        where: { user_id: user!.id, book_id: bookId },
      });

      expect(userBook).toBeDefined();

      await UserBookCollection.destroy({
        where: { collection_id: collectionId, user_book_id: userBook!.id },
      });

      const existingEntry = await UserBookCollection.findOne({
        where: { collection_id: collectionId, user_book_id: userBook!.id },
      });
      expect(existingEntry).toBeNull();

      await expect(
        addBookToCollection(email, collectionId, bookId)
      ).resolves.not.toThrow();

      const addedEntry = await UserBookCollection.findOne({
        where: { collection_id: collectionId, user_book_id: userBook!.id },
      });
      expect(addedEntry).toBeDefined();
    }
  );
});

// Negative test cases for addBookToCollection
type AddBookToCollectionNegativeTestCase = [
  string,
  number,
  number,
  typeof NotFoundError | typeof ValidationError,
  string
];

const addBookToCollectionNegativeCases: AddBookToCollectionNegativeTestCase[] =
  [
    [
      user1Email,
      1,
      999,
      NotFoundError,
      "UserBook entry not found. Add the book to the user first.",
    ],
    [
      user1Email,
      1,
      1,
      ValidationError,
      "Book already exists in the collection",
    ],
  ];

describe("addBookToCollection function negative tests", () => {
  test.each(addBookToCollectionNegativeCases)(
    "should throw an error (email: %s, collectionId: %i, bookId: %i, errorClass: %s, errorMessage: %s)",
    async (
      email: string,
      collectionId: number,
      bookId: number,
      errorClass: typeof NotFoundError | typeof ValidationError,
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

// Positive test cases for removeBookFromCollection
type RemoveBookFromCollectionTestCase = [string, number, number];
const removeBookFromCollectionPositiveCases: RemoveBookFromCollectionTestCase[] =
  [
    [user1Email, 1, 1],
    [user2Email, 2, 2],
  ];

describe("removeBookFromCollection function positive tests", () => {
  test.each(removeBookFromCollectionPositiveCases)(
    "should remove a book from a collection (email: %s, collectionId: %i, bookId: %i)",
    async (email: string, collectionId: number, bookId: number) => {
      try {
        await addBookToCollection(email, collectionId, bookId);
      } catch (error) {
        if (error.message !== "Book already exists in the collection") {
          throw error;
        }
      }

      await expect(
        removeBookFromCollection(email, collectionId, bookId)
      ).resolves.not.toThrow();
    }
  );
});

// Negative test cases for removeBookFromCollection
type RemoveBookFromCollectionNegativeTestCase = [
  string,
  number,
  number,
  typeof NotFoundError,
  string
];

const removeBookFromCollectionNegativeCases: RemoveBookFromCollectionNegativeTestCase[] =
  [
    [user1Email, 999, 1, NotFoundError, "Collection not found"],
    [user1Email, 1, 999, NotFoundError, "UserBook entry not found"],
    [
      user1Email,
      1,
      1,
      NotFoundError,
      "Book not found in the collection",
    ],
  ];

describe("removeBookFromCollection function negative tests", () => {
  test.each(removeBookFromCollectionNegativeCases)(
    "should throw an error (email: %s, collectionId: %i, bookId: %i, errorClass: %s, errorMessage: %s)",
    async (
      email: string,
      collectionId: number,
      bookId: number,
      errorClass: typeof NotFoundError,
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
