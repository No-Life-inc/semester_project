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
