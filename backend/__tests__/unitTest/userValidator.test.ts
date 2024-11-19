import { describe, expect, test } from "@jest/globals";
import { validatePassword, validateEmail } from "../../services/validatorService";

describe("validatePassword function tests", () => {

    // **Positive Tests**
    test("should pass for a valid password", () => {
        expect(() => validatePassword("Valid123")).not.toThrow();
        expect(() => validatePassword("Another1StrongPass")).not.toThrow();
    });

    // **Negative Tests**
    test("should throw an error if password is empty or only whitespace", () => {
        expect(() => validatePassword("")).toThrow("Password cannot be whitespace.");
        expect(() => validatePassword("     ")).toThrow("Password cannot be whitespace.");
    });

    test("should throw an error if password contains spaces", () => {
        expect(() => validatePassword("pass word")).toThrow("Password cannot contain a space.");
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

    // **Boundary Tests**
    test("should throw an error if password is less than 8 characters", () => {
        expect(() => validatePassword("Pass1")).toThrow("Password must be at least 8 characters long.");
        expect(() => validatePassword("Pass12")).toThrow("Password must be at least 8 characters long.");
        expect(() => validatePassword("Passwor")).toThrow("Password must be at least 8 characters long.");
    });

    test("should pass if password is exactly 8 characters and valid", () => {
        expect(() => validatePassword("Pass1234")).not.toThrow();
    });
});

describe("validateEmail function tests", () => {

    // **Positive Tests**
    test("should pass for a valid email", () => {
        expect(() => validateEmail("test@example.com")).not.toThrow();
        expect(() => validateEmail("user.name@domain.co")).not.toThrow();
        expect(() => validateEmail("user_name@sub.domain.com")).not.toThrow();
    });

    // **Negative Tests**
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

    // **Boundary Tests**
    test("should pass for email with minimum valid format", () => {
        expect(() => validateEmail("a@b.c")).not.toThrow();
    });

    test("should throw an error if email contains spaces", () => {
        expect(() => validateEmail("user @example.com")).toThrow("Invalid email format.");
        expect(() => validateEmail("user@ example.com")).toThrow("Invalid email format.");
        expect(() => validateEmail(" user@example.com")).toThrow("Invalid email format.");
        expect(() => validateEmail("user@example.com ")).toThrow("Invalid email format.");
    });
});