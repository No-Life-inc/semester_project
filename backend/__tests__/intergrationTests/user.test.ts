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

describe("Positive User data boundary tests", () => {
    const maxName = "A".repeat(255);
    const maxEmail = "a".repeat(243) + "@example.com";
    const validPassword = "StrongPass123";
    const minPassword = "Pass1234";

    const positiveCases = [
        // Name cases
        ["should accept minimal valid name (2 char)", { name: "AB", email: "valid1@example.com", password: validPassword }],
        ["should accept typical name", { name: "John Doe", email: "valid2@example.com", password: validPassword }],
        ["should accept maximal valid name (255 chars)", { name: maxName, email: "valid3@example.com", password: validPassword }],
        // Email cases
        ["should accept minimal valid email", { name: "Valid User", email: "a@b.dk", password: validPassword }], //Shortest valid email based on RFC 5321
        ["should accept typical email", { name: "Valid User", email: "user.name@domain.co", password: validPassword }],
        ["should accept maximal valid email (255 chars)", { name: "Valid User", email: maxEmail, password: validPassword }],
        // Password cases
        ["should accept minimal valid password (8 chars)", { name: "Valid User", email: "valid6@example.com", password: minPassword }],
        ["should accept typical password", { name: "Valid User", email: "valid7@example.com", password: validPassword }],
    ];

    test.each(positiveCases)(
        "%s",
        async (description: string, fieldData: { name: string; email: string; password: string }) => {
            const { name, email, password } = fieldData;
            const newUser = await registerUser(name, email, password);
            expect(newUser).toBeDefined();
            expect(newUser.name).toBe(name);
            expect(newUser.email).toBe(email);
            expect(newUser.password).not.toBe(password); // Ensure it is hashed
        }
    );
});

describe("Negative User data boundary tests (including edge cases)", () => {
    const overMaxName = "A".repeat(256); // Exceeds the max name length
    const emptyName = ""; // Edge case: Completely empty name
    const whitespaceName = "   "; // Edge case: Name with only whitespace

    const overMaxEmail = "a".repeat(244) + "@example.com"; // Exceeds the max email length
    const emptyEmail = ""; // Edge case: Completely empty email
    const whitespaceEmail = "   "; // Edge case: Email with only whitespace

    const validPassword = "StrongPass123";
    const invalidShortPassword = "Short1"; // Below minimum length
    const emptyPassword = ""; // Edge case: Completely empty password
    const whitespacePassword = "       "; // Edge case: Password with only whitespace

    const invalidEmailFormats = [
        "plainaddress",
        "missingatsign.com",
        "user@.com",
        "user@com",
        "user@domain,com",
        "user @example.com",
    ];

    const negativeCases = [
        // Name cases
        ["should reject name exceeding 255 chars", { name: overMaxName, email: "valid@example.com", password: validPassword }],
        ["should reject empty name", { name: emptyName, email: "valid@example.com", password: validPassword }],
        ["should reject name with only whitespace", { name: whitespaceName, email: "valid@example.com", password: validPassword }],
        // Email cases
        ["should reject email exceeding 255 chars", { name: "Valid User", email: overMaxEmail, password: validPassword }],
        ["should reject empty email", { name: "Valid User", email: emptyEmail, password: validPassword }],
        ["should reject email with only whitespace", { name: "Valid User", email: whitespaceEmail, password: validPassword }],
        ...invalidEmailFormats.map((email) => [
            `should reject invalid email format (${email})`,
            { name: "Invalid Email User", email, password: validPassword },
        ]),
        // Password cases
        ["should reject password less than 8 chars", { name: "Valid User", email: "valid@example.com", password: invalidShortPassword }],
        ["should reject empty password", { name: "Valid User", email: "valid@example.com", password: emptyPassword }],
        ["should reject password with only whitespace", { name: "Valid User", email: "valid@example.com", password: whitespacePassword }],
    ];

    test.each(negativeCases)(
        "%s",
        async (description: string, fieldData: { name: string; email: string; password: string }) => {
            const { name, email, password } = fieldData;
            await expect(registerUser(name, email, password)).rejects.toThrow();
        }
    );
});



describe("loginUser function tests", () => {
    test("should log in a user with correct credentials", async () => {
        const result = await loginUser("test@test.com", process.env.DEFAULT_PASSWORD );

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


