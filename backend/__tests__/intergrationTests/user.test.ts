import { afterAll, beforeAll, describe, expect, jest, test } from "@jest/globals";
import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";
import { registerUser, loginUser, editUser, editPassword  } from "../../services/userService";

jest.setTimeout(30000);

beforeAll(async () => {
    await setupTestDB();
});

afterAll(async () => {
    await teardownTestDB();
});

describe("registerUser function tests", () => {
    test("should register a new user with valid data", async () => {
        const newUser = await registerUser("Test User", "unique@example.com", "StrongPassword123");
        expect(newUser).toBeDefined();
        expect(newUser.name).toBe("Test User");
        expect(newUser.email).toBe("unique@example.com");
    });

    test("should throw an error if email is already in use", async () => {
        const email = "duplicate@example.com";
        await registerUser("Existing User", email, "Password123");

        await expect(registerUser("Another User", email, "Password123")).rejects.toThrow(
            "Email is already in use."
        );
    });

    test("should throw an error if email is invalid", async () => {
        await expect(registerUser("Test User", "invalid-email", "Password123")).rejects.toThrow(
            "Invalid email format."
        );
    });

    test("should throw an error if password is invalid", async () => {
        await expect(registerUser("Test User", "valid@example.com", "short")).rejects.toThrow(
            "Password must be at least 8 characters long."
        );
    });
});

describe("loginUser function tests", () => {
    test("should log in a user with correct credentials", async () => {
        const result = await loginUser("test@test.com", "Test1234");

        expect(result).toBeDefined();
        expect(result.user.email).toBe("test@test.com");
        expect(result.token).toBeDefined();
        expect(result.user.password).toBeUndefined()
    });

    test("should throw an error for incorrect email", async () => {
        await expect(loginUser("wrong@example.com", "Test1234")).rejects.toThrow(
            "Invalid email or password."
        );
    });

    test("should throw an error for incorrect password", async () => {
        const user = await registerUser("Test User", "passwordcheck@example.com", "ValidPassword123");

        await expect(loginUser("passwordcheck@example.com", "WrongPassword")).rejects.toThrow(
            "Invalid email or password."
        );
    });
});

/*
describe("editUser function tests with seeded data", () => {
    const token = generateToken({ email: "seededuser@example.com" }); // Generer en token til den seeded bruger

    test("should update the user's name and email", async () => {
        const message = await editUser(token, "Updated Name", "updatedemail@example.com");
        expect(message).toBe("User details have been updated successfully.");
    });

    test("should throw an error for invalid email", async () => {
        await expect(editUser(token, "Updated Name", "invalid-email")).rejects.toThrow(
            "Invalid email format."
        );
    });

    test("should throw an error if user is not found", async () => {
        const fakeToken = generateToken({ email: "nonexistentuser@example.com" });

        await expect(editUser(fakeToken, "New Name", "newemail@example.com")).rejects.toThrow(
            "User not found."
        );
    });
});



describe("editPassword function tests with seeded data", () => {
    const token = generateToken({ email: "seededuser@example.com" }); // Generer en token til den seeded bruger

    test("should update the user's password with the correct old password", async () => {
        const message = await editPassword(token, "OldPassword123", "NewPassword123"); // "OldPassword123" er den gamle adgangskode fra seed-data
        expect(message).toBe("Your password has been updated successfully.");
    });

    test("should throw an error for incorrect old password", async () => {
        await expect(editPassword(token, "WrongOldPassword", "NewPassword123")).rejects.toThrow(
            "Invalid password."
        );
    });

    test("should throw an error for an invalid new password", async () => {
        await expect(editPassword(token, "OldPassword123", "weak")).rejects.toThrow(
            "Password does not meet the required criteria."
        );
    });

    test("should throw an error if user is not found", async () => {
        const fakeToken = generateToken({ email: "nonexistentuser@example.com" });

        await expect(editPassword(fakeToken, "OldPassword123", "NewPassword123")).rejects.toThrow(
            "User not found."
        );
    });
});*/
