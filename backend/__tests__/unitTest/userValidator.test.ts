import { describe, expect, test } from "@jest/globals";
import {validatePassword, validateEmail, validateName} from "../../services/validatorService";

describe("validatePassword function - Positive Tests", () => {
    test("should pass for a valid password", () => {
        expect(() => validatePassword("Valid123")).not.toThrow();
        expect(() => validatePassword("Another1StrongPass")).not.toThrow();
    });

    test("should pass if password is exactly 8 characters and valid", () => {
        expect(() => validatePassword("Pass1234")).not.toThrow();
    });
});

describe("validatePassword function - Negative Tests", () => {
    test("should throw an error if password is empty or only whitespace", () => {
        expect(() => validatePassword("")).toThrow("Password cannot be whitespace.");
        expect(() => validatePassword("     ")).toThrow("Password cannot be whitespace.");
    });

    test("should throw an error if password contains spaces", () => {
        expect(() => validatePassword("pass word")).toThrow("Password cannot contain spaces.");
    });

    test("should throw an error if password does not contain a lowercase letter", () => {
        expect(() => validatePassword("PASSWORD123")).toThrow("Password must contain at least one lowercase letter.");
    });

    test("should throw an error if password does not contain an uppercase letter", () => {
        expect(() => validatePassword("password123")).toThrow("Password must contain at least one uppercase letter.");
    });

    test("should throw an error if password does not contain a digit", () => {
        expect(() => validatePassword("Password")).toThrow("Password must contain at least one digit.");
    });

    test("should throw an error if password is less than 8 characters", () => {
        expect(() => validatePassword("Pass1")).toThrow("Password must be at least 8 characters long.");
        expect(() => validatePassword("Pass12")).toThrow("Password must be at least 8 characters long.");
        expect(() => validatePassword("Passwor")).toThrow("Password must be at least 8 characters long.");
    });
});


describe("validateEmail function - Positive Tests", () => {
    test("should pass for a valid email", () => {
        expect(() => validateEmail("test@example.com")).not.toThrow();
        expect(() => validateEmail("user.name@domain.co")).not.toThrow();
        expect(() => validateEmail("user_name@sub.domain.com")).not.toThrow();
    });

    test("should pass for email with minimum valid format", () => {
        expect(() => validateEmail("a@b.c")).not.toThrow();
    });

    test("should pass with email max length", () => {
        const maxEmail = "a".repeat(243) + "@example.com";

        expect(() => validateEmail(maxEmail)).not.toThrow();
    });
});

describe("validateEmail function - Negative Tests", () => {
    test("should throw an error if email is empty or only whitespace", () => {
        expect(() => validateEmail("")).toThrow("Email cannot be empty or whitespace.");
        expect(() => validateEmail("     ")).toThrow("Email cannot be empty or whitespace.");
    });

    test("should throw an error if email format is invalid", () => {
        expect(() => validateEmail("plainaddress")).toThrow("Invalid email format.");
        expect(() => validateEmail("missingatsign.com")).toThrow("Invalid email format.");
        expect(() => validateEmail("user@.com")).toThrow("Invalid email format.");
        expect(() => validateEmail("user@com")).toThrow("Invalid email format.");
        expect(() => validateEmail("user@domain,com")).toThrow("Invalid email format.");
    });

    test("should throw an error if email contains spaces", () => {
        expect(() => validateEmail("user @example.com")).toThrow("Invalid email format.");
        expect(() => validateEmail("user@ example.com")).toThrow("Invalid email format.");
        expect(() => validateEmail(" user@example.com")).toThrow("Invalid email format.");
        expect(() => validateEmail("user@example.com ")).toThrow("Invalid email format.");
    });

    test("should throw an error if email exceeds the maximum allowed length", () => {
        const overMaxEmail = "a".repeat(244) + "@example.com"; // 256 chars (invalid)

        expect(() => validateEmail(overMaxEmail)).toThrow("Email cannot be more than 255 characters long."); // This should throw
    });
});

describe("validateName function - Positive Tests", () => {
    test("should pass for a valid name", () => {
        expect(() => validateName("John")).not.toThrow();
        expect(() => validateName("Anna")).not.toThrow();
        expect(() => validateName("Jo")).not.toThrow();
    });

    test("should pass for a name with exactly 2 characters", () => {
        expect(() => validateName("AB")).not.toThrow();
    });

    test("should pass for a name with trailing or leading spaces (trimmed)", () => {
        expect(() => validateName("  John  ")).not.toThrow();
    });

    test("should pass for a name with special characters", () => {
        expect(() => validateName("O'Connor")).not.toThrow();
        expect(() => validateName("Jean-Luc")).not.toThrow();
        expect(() => validateName("Anna-Maria")).not.toThrow();
    });

    test("should pass for a very long valid name within typical limits", () => {
        const longValidName = "A".repeat(255); // Typical limit for a name field
        expect(() => validateName(longValidName)).not.toThrow();
    });
});

describe("validateName function - Negative Tests", () => {
    test("should throw an error if name is empty or only whitespace", () => {
        expect(() => validateName("")).toThrow("Name cannot be empty or whitespace.");
        expect(() => validateName("   ")).toThrow("Name cannot be empty or whitespace.");
    });

    test("should throw an error if name is less than 2 characters", () => {
        expect(() => validateName("A")).toThrow("Name must be at least 2 characters long.");
    });

    test("should throw an error if name is excessively long", () => {
        const longName = "A".repeat(256);
        expect(() => validateName(longName)).toThrow("Name cannot be more than 255 characters long.");
    });

    test("should throw an error for a name with numbers or invalid characters", () => {
        expect(() => validateName("John123")).toThrow("Invalid characters in name.");
        expect(() => validateName("Anna@")).toThrow("Invalid characters in name.");
    });
});


