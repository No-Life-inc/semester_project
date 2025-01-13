import { afterAll, beforeAll, describe, expect, jest, test } from "@jest/globals";
import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";
import {registerUser, loginUser, editUser, editPassword, getUserIdByEmail} from "../../services/userService";
import {ConflictError, UnauthorizedError, ValidationError} from "../../utility/errors";

jest.setTimeout(120000);

const validPassword = process.env.DEFAULT_PASSWORD;

beforeAll(async () => {
    await setupTestDB();
});

afterAll(async () => {
    await teardownTestDB();
});

describe("Positive Register user data boundary tests", () => {
    const minPassword = "Pass1234";

    const positiveCases = [
        // Name cases
        ["should accept minimal valid name (2 char)", { name: "AB", email: "valid1@example.com", password: validPassword }],
        ["should accept one above minimal valid name (3 char)", { name: "ABC", email: "valid2@example.com", password: validPassword }],
        ["should accept typical name", { name: "John Doe", email: "valid3@example.com", password: validPassword }],
        ["should accept one below maximal valid name (254 chars)", { name: "A".repeat(254), email: "valid4@example.com", password: validPassword }],
        ["should accept maximal valid name (255 chars)", { name: "A".repeat(255), email: "valid5@example.com", password: validPassword }],
        // Email cases
        ["should accept minimal valid email", { name: "Valid User", email: "a@b.dk", password: validPassword }], //Shortest valid email based on RFC 5321
        ["should accept one above minimal valid email", { name: "Valid User", email: "a@bc.dk", password: validPassword }],
        ["should accept typical email", { name: "Valid User", email: "user.name@domain.co", password: validPassword }],
        ["should accept one below maximal valid email (254 chars)", { name: "Valid User", email: "a".repeat(242) + "@example.com", password: validPassword }],
        ["should accept maximal valid email (255 chars)", { name: "Valid User", email: "a".repeat(243) + "@example.com", password: validPassword }],
        // Password cases
        ["should accept minimal valid password (8 chars)", { name: "Valid User", email: "valid6@example.com", password: minPassword }],
        ["should accept one above minimal valid password (9 chars)", { name: "Valid User", email: "valid7@example.com", password: minPassword+"1" }],
        ["should accept typical password", { name: "Valid User", email: "valid8@example.com", password: validPassword }],
        ["should accept one below maximal valid password (127 chars)", { name: "Valid User", email: "valid9@example.com", password: "A".repeat(125)+ "b1" }],
        ["should accept maximal valid password (128 chars)", { name: "Valid User", email: "valid10@example.com", password: "A".repeat(126) + "b1" }],
    ];

    test.each(positiveCases)(
        "%s",
        async (description: string, fieldData: { name: string; email: string; password: string }) => {
            const { name, email, password } = fieldData;
            const newUser = await registerUser(name, email, password);
            expect(newUser).toBeDefined();
            expect(newUser.name).toBe(name);
            expect(newUser.email).toBe(email);
            expect(newUser.password).not.toBe(password);
        }
    );
});

describe("Negative User data boundary tests (including edge cases)", () => {
    const overMaxName = "A".repeat(256);
    const emptyName = "";
    const whitespaceName = "   ";

    const overMaxEmail = "a".repeat(244) + "@example.com";
    const emptyEmail = "";
    const whitespaceEmail = "   ";

    const invalidShortPassword = "Short1";
    const emptyPassword = "";
    const whitespacePassword = "       ";

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
        ["should reject null name", { name: null, email: "valid@example.com", password: validPassword }],
        ["should reject undefined name", { name: undefined, email: "valid@example.com", password: validPassword }],
        ["should reject name as negative number", { name: -1 as any, email: "valid@example.com", password: validPassword }],
        ["should reject name as 0", { name: 0 as any, email: "valid@example.com", password: validPassword }],

        // Email cases
        ["should reject email exceeding 255 chars", { name: "Valid User", email: overMaxEmail, password: validPassword }],
        ["should reject empty email", { name: "Valid User", email: emptyEmail, password: validPassword }],
        ["should reject null email", { name: "Valid User", email: null, password: validPassword }],
        ["should reject undefined email", { name: "Valid User", email: undefined, password: validPassword }],
        ["should reject email as negative number", { name: "Valid User", email: -1 as any, password: validPassword }],
        ["should reject email as 0", { name: "Valid User", email: 0 as any, password: validPassword }],
        ["should reject email with only whitespace", { name: "Valid User", email: whitespaceEmail, password: validPassword }],
        ...invalidEmailFormats.map((email) => [
            `should reject invalid email format (${email})`,
            { name: "Invalid Email User", email, password: validPassword },
        ]),
        // Password cases
        ["should reject password less than 8 chars", { name: "Valid User", email: "valid@example.com", password: invalidShortPassword }],
        ["should reject empty password", { name: "Valid User", email: "valid@example.com", password: emptyPassword }],
        ["should reject password with only whitespace", { name: "Valid User", email: "valid@example.com", password: whitespacePassword }],
        ["should reject null password", { name: "Valid User", email: "valid@example.com", password: null }],
        ["should reject undefined password", { name: "Valid User", email: "valid@example.com", password: undefined }],
        ["should reject password as negative number", { name: "Valid User", email: "valid@example.com", password: -1 as any }],
        ["should reject password as 0", { name: "Valid User", email: "valid@example.com", password: 0 as any }],
    ];

    test.each(negativeCases)(
        "%s",
        async (description: string, fieldData: { name: string; email: string; password: string }) => {
            const { name, email, password } = fieldData;
            await expect(registerUser(name, email, password)).rejects.toThrow(ValidationError);
        }
    );

    test("should throw ConflictError if email is already in use", async () => {
        await expect(registerUser("Valid User",  "test@test.com",  validPassword))
            .rejects.toThrow(new ConflictError("Email is already in use."));
    });
});


describe("loginUser function - Positive Tests", () => {
    test("should log in a user with correct credentials", async () => {
        const result = await loginUser("test@test.com", validPassword);

        expect(result).toBeDefined();
        expect(result.user.email).toBe("test@test.com");
        expect(result.token).toBeDefined();
        expect(result.user.password).toBeUndefined();
    });
});

describe("loginUser function - Negative Tests", () => {
    const negativeCases = [
        ["should throw an error for incorrect email", "wrong@example.com", validPassword],
        ["should throw an error for incorrect password", "test@test.com", "WrongPassword"],
        ["should throw an error for both incorrect email and password", "wrong@example.com", "WrongPassword"],
        ["should throw an error for empty email", "", validPassword],
        ["should throw an error for empty password", "test@test.com", ""],
        ["should throw an error for email with only whitespace", "   ", validPassword],
        ["should throw an error for password with only whitespace", "test@test.com", "   "],
    ];

    test.each(negativeCases)(
        "%s",
        async (description, email, password) => {
            await expect(loginUser(email, password)).rejects.toThrow("Invalid email or password.");
        }
    );

    test("should throw AuthenticationError for incorrect credentials", async () => {
        await expect(loginUser("wrong@example.com", "WrongPassword")).rejects.toThrow(new UnauthorizedError("Invalid email or password."));
    });
});

describe("EditPassword Positive Tests", () => {
    const positiveCases = [
        ["should accept minimal valid password (8 chars)", "valid1@example.com", validPassword, "Pass1234"],
        ["should accept one above minimal valid password (9 chars)", "valid2@example.com", validPassword, "Pass12345"],
        ["should accept typical password", "valid3@example.com", validPassword, "NewPassword123"],
        ["should accept one below maximal valid password (127 chars)", "valid4@example.com", validPassword, "A".repeat(125) + "b1"],
        ["should accept maximal valid password (128 chars)", "valid5@example.com", validPassword, "A".repeat(126) + "b1"],
    ];

    test.each(positiveCases)(
        "%s",
        async (description, email, oldPassword, newPassword) => {
            const result = await editPassword(email, oldPassword, newPassword);
            expect(result).toBe("Your password has been updated successfully.");
        }
    );
});

describe("EditPassword Negative Tests", () => {
    const negativeCases = [
        ["should throw an error for incorrect old password", "valid1@example.com", "WrongOldPassword", "NewPassword123", "Old password is incorrect."],
        ["should throw an error for non-existing user", "nonexistent_user@example.com", validPassword, "NewPassword123", "User not found."],
        ["should throw an error for too short password", "test_user@example.com", validPassword, "short", "Password must be at least 8 characters long."],
        ["should throw an error for too long password", "test_user@example.com", validPassword, "A".repeat(129), "Password cannot exceed 128 characters."],
    ];

    test.each(negativeCases)(
        "%s",
        async (description, email, oldPassword, newPassword, expectedError) => {
            await expect(editPassword(email, oldPassword, newPassword)).rejects.toThrow(expectedError);
        }
    );
});

describe("editUser function - Positive Boundary Tests", () => {
    const positiveCases = [
        // Name cases
        ["should accept minimal valid name (2 chars)", "test_email@example.com", "AB", null],
        ["should accept one above minimal valid name (3 chars)", "test_email@example.com", "ABC", null],
        ["should accept typical name", "test_email@example.com", "John Doe", null],
        ["should accept one below maximal valid name (254 chars)", "test_email@example.com", "A".repeat(254), null],
        ["should accept maximal valid name (255 chars)", "test_email@example.com", "A".repeat(255), null],
        // Email cases
        ["should accept minimal valid email", "a@b.dk", null, "c@d.dk"],
        ["should accept one above minimal valid email", "a@bc.dk", null, "d@ef.dk"],
        ["should accept typical email", "d@ef.dk", null, "user.name@domain.com"],
        ["should accept one below maximal valid email (254 chars)", "user.name@domain.com", null, "b".repeat(242) + "@example.com"],
        ["should accept maximal valid email (255 chars)", "c@d.dk", null, "b".repeat(243) + "@example.com"],
        // Cases where both fields are updated
        ["should update both name and email", "valid1@example.com", "Updated Name", "updated@example.com"],
        ["should update both to maximal valid values", "valid2@example.com", "A".repeat(255), "c".repeat(243) + "@example.com"],
        ["should update both to minimal valid values", "valid3@example.com", "AB", "a@b.dk"],
        ["should update typical name and email", "valid4@example.com", "John Doe", "new.email@domain.com"],
    ];

    test.each(positiveCases)(
        "%s",
        async (description, originalEmail, newName, newEmail) => {
            const result = await editUser(originalEmail, newName, newEmail);

            if (newName !== null && newName !== undefined) {
                expect(result.user.name).toBe(newName);
            }

            if (newEmail !== null && newEmail !== undefined) {
                expect(result.user.email).toBe(newEmail);
            }

            expect(result.newToken).toBeDefined();
        }
    );
});

describe("editUser function - Negative Tests", () => {
    const negativeCases = [
        ["should throw an error if user is not found", "nonexistent@example.com", "Updated Name", "updated@example.com", "User not found."],
        ["should throw an error for invalid email format", "test_email@example.com", "Updated Name", "invalid-email", "Invalid email format"],
        ["should throw an error for name being too short", "test_email@example.com", "A", "updated@example.com", "Name must be at least 2 characters long."],
        ["should throw an error for null name", null as any, null as any, null as any,"User not found."],
    ];

    test.each(negativeCases)(
        "%s",
        async (description, email, name, newEmail, expectedError) => {
            await expect(editUser(email, name, newEmail)).rejects.toThrow(expectedError);
        }
    );
});


describe("getUserIdByEmail function - Positive Tests", () => {
    beforeAll(async () => {
        await registerUser("Test User", "positive_test@example.com", "Password123!");
    });

    const positiveCases = [
        ["should return the user ID for an existing user", "positive_test@example.com"],
    ];

    test.each(positiveCases)(
        "%s",
        async (description, email) => {
            const userId = await getUserIdByEmail(email);
            expect(userId).toBeDefined();
            expect(typeof userId).toBe("number");
        }
    );
});

describe("getUserIdByEmail function - Negative Tests", () => {
    const negativeCases = [
        ["should throw a ValidationError for an empty email", "", "Email cannot be empty or whitespace."],
        ["should throw a ValidationError for a null email", null as any, "Email cannot be empty or whitespace."],
        ["should throw a ValidationError for an undefined email", undefined as any, "Email cannot be empty or whitespace."],
        ["should throw a ValidationError for an email with only whitespace", "   ", "Email cannot be empty or whitespace."],
        ["should throw a NotFoundError if the user does not exist", "nonexistent_user@example.com", "User not found."],
    ];

    test.each(negativeCases)(
        "%s",
        async (description, email, expectedError) => {
            await expect(getUserIdByEmail(email)).rejects.toThrow(expectedError);
        }
    );
});
