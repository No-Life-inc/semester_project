import { describe, expect, test } from "@jest/globals";
import {
    validatePassword,
    validateEmail,
    validateName
} from "../../services/validatorService";

describe("validatePassword function - Positive Tests", () => {
    test.each([
        ["Valid123"],
        ["Another1StrongPass"],
        ["Pass1234"]
    ])("should pass for valid password '%s'", (password) => {
        const act = () => validatePassword(password);
        expect(act).not.toThrow();
    });
});

describe("validatePassword function - Negative Tests", () => {
    test.each([
        ["", "Password cannot be whitespace."],
        ["     ", "Password cannot be whitespace."]
    ])("should throw an error if password is empty or only whitespace '%s'", (password, expectedError) => {
        const act = () => validatePassword(password);
        expect(act).toThrow(expectedError);
    });

    test("should throw an error if password contains spaces", () => {
        const invalidPassword = "pass word";
        const act = () => validatePassword(invalidPassword);
        expect(act).toThrow("Password cannot contain spaces.");
    });

    test("should throw an error if password does not contain a lowercase letter", () => {
        const invalidPassword = "PASSWORD123";
        const act = () => validatePassword(invalidPassword);
        expect(act).toThrow("Password must contain at least one lowercase letter.");
    });

    test("should throw an error if password does not contain an uppercase letter", () => {
        const invalidPassword = "password123";
        const act = () => validatePassword(invalidPassword);
        expect(act).toThrow("Password must contain at least one uppercase letter.");
    });

    test("should throw an error if password does not contain a digit", () => {
        const invalidPassword = "Password";
        const act = () => validatePassword(invalidPassword);
        expect(act).toThrow("Password must contain at least one digit.");
    });

    test.each([
        ["Pass1"],
        ["Pass12"],
        ["Passwor"]
    ])("should throw an error if password is less than 8 characters: '%s'", (password) => {
        const act = () => validatePassword(password);
        expect(act).toThrow("Password must be at least 8 characters long.");
    });
});

describe("validateEmail function - Positive Tests", () => {
    test.each([
        ["test@example.com"],
        ["user.name@domain.co"],
        ["user_name@sub.domain.com"],
        ["a@b.dk"]
    ])("should pass for valid email '%s'", (email) => {
        const act = () => validateEmail(email);
        expect(act).not.toThrow();
    });

    test("should pass with email max length", () => {
        const maxEmail = "a".repeat(243) + "@example.com";
        const act = () => validateEmail(maxEmail);
        expect(act).not.toThrow();
    });
});

describe("validateEmail function - Negative Tests", () => {
    test.each([
        ["", "Email cannot be empty or whitespace."],
        ["   ", "Email cannot be empty or whitespace."]
    ])("should throw an error if email is empty or only whitespace '%s'", (email, expectedError) => {
        const act = () => validateEmail(email);
        expect(act).toThrow(expectedError);
    });

    test.each([
        "plainaddress",
        "missingatsign.com",
        "user@.com",
        "user@com",
        "user@domain,com"
    ])("should throw an error if email format is invalid '%s'", (email) => {
        const act = () => validateEmail(email);
        expect(act).toThrow("Invalid email format.");
    });

    test.each([
        "user @example.com",
        "user@ example.com",
        " user@example.com",
        "user@example.com "
    ])("should throw an error if email contains spaces '%s'", (email) => {
        const act = () => validateEmail(email);
        expect(act).toThrow("Invalid email format.");
    });

    test("should throw an error if email exceeds the maximum allowed length", () => {
        const overMaxEmail = "a".repeat(244) + "@example.com";
        const act = () => validateEmail(overMaxEmail);
        expect(act).toThrow("Email cannot be more than 255 characters long.");
    });
});

describe("validateName function - Positive Tests", () => {
    test.each([
        "John",
        "Anna",
        "Jo"
    ])("should pass for a valid name '%s'", (name) => {
        const act = () => validateName(name);
        expect(act).not.toThrow();
    });

    test("should pass for a name with exactly 2 characters", () => {
        const twoCharName = "AB";
        const act = () => validateName(twoCharName);
        expect(act).not.toThrow();
    });

    test("should pass for a name with trailing or leading spaces (trimmed)", () => {
        const spacedName = "  John  ";
        const act = () => validateName(spacedName);
        expect(act).not.toThrow();
    });

    test.each([
        "O'Connor",
        "Jean-Luc",
        "Anna-Maria"
    ])("should pass for a name with special characters '%s'", (name) => {
        const act = () => validateName(name);
        expect(act).not.toThrow();
    });

    test("should pass for a very long valid name within typical limits", () => {
        const longValidName = "A".repeat(255);
        const act = () => validateName(longValidName);
        expect(act).not.toThrow();
    });
});

describe("validateName function - Negative Tests", () => {
    test.each([
        ["", "Name cannot be empty or whitespace."],
        ["   ", "Name cannot be empty or whitespace."]
    ])("should throw an error if name is empty or only whitespace '%s'", (name, expectedError) => {
        const act = () => validateName(name);
        expect(act).toThrow(expectedError);
    });

    test("should throw an error if name is less than 2 characters", () => {
        const singleCharName = "A";
        const act = () => validateName(singleCharName);
        expect(act).toThrow("Name must be at least 2 characters long.");
    });

    test("should throw an error if name is excessively long", () => {
        const longName = "A".repeat(256);
        const act = () => validateName(longName);
        expect(act).toThrow("Name cannot be more than 255 characters long.");
    });

    test.each([
        "John123",
        "Anna@"
    ])("should throw an error for invalid characters '%s'", (name) => {
        const act = () => validateName(name);
        expect(act).toThrow("Invalid characters in name.");
    });
});
