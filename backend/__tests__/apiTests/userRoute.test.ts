import { afterAll, beforeAll, describe, expect, jest, test } from "@jest/globals";
import request from "supertest";
import express from "express";
import userRouter from "../../routes/V1/userRoutes";
import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";
import { getUserToken, userSetup, teardownUserSetup } from "../utility/userSetup";

jest.setTimeout(120000);

const app = express();
app.use(express.json());
app.use("/user", userRouter);

beforeAll(async () => {
    await setupTestDB();
    await userSetup();
});

afterAll(async () => {
    await teardownTestDB();
    await teardownUserSetup();
});

describe("Register - Positive Tests", () => {
    const positiveCases: [string, { name: string; email: string; password: string }, number, { name: string; email: string }][] = [
        ["should register a new user with valid data", { name: "New User", email: "newuser@test.com", password: "Password123" }, 201, { name: "New User", email: "newuser@test.com" }],
    ];

    test.each(positiveCases)(
        "%s",
        async (description, payload, expectedStatus, expectedBody) => {
            const response = await request(app).post("/user/register").send(payload);
            expect(response.status).toBe(expectedStatus);
            expect(response.body).toMatchObject(expectedBody);
        }
    );
});

describe("Register - Negative Tests", () => {
    const negativeCases: [string, Partial<{ name: string; email: string; password: string }>, number, string][] = [
        ["should return 409 if email is already in use", { name: "Existing User", email: "test_email@example.com", password: "Password123" }, 409, "Email is already in use."],
        ["should return 422 if invalid email is provided", { name: "Invalid Email User", email: "invalid-email", password: "Password123" }, 422, "Invalid email format."],
        ["should return 400 if no password is provided", { name: "No Password", email: "nopassword@test.com" }, 400, "Name, email, and password are required"],
    ];

    test.each(negativeCases)(
        "%s",
        async (description, payload, expectedStatus, expectedError) => {
            const response = await request(app).post("/user/register").send(payload);
            expect(response.status).toBe(expectedStatus);
            expect(response.body.error).toBe(expectedError);
        }
    );
});

describe("Login - Positive Tests", () => {
    const positiveCases: [string, string, string, number][] = [
        ["should log in user with valid credentials", "test_email@example.com", process.env.DEFAULT_PASSWORD as string, 200],
    ];

    test.each(positiveCases)(
        "%s",
        async (description, email, password, expectedStatus) => {
            const response = await request(app).post("/user/login").send({ email, password });
            expect(response.status).toBe(expectedStatus);
            expect(response.body).toHaveProperty("user");
            expect(response.body).toHaveProperty("token");
        }
    );
});

describe("Login - Negative Tests", () => {
    const negativeCases: [string, string, string, number, string][] = [
        ["should return 401 if email is invalid", "invalid_email@test.com", process.env.DEFAULT_PASSWORD as string, 401, "Invalid email or password."],
        ["should return 401 if password is incorrect", "test_email@example.com", "WrongPassword", 401, "Invalid email or password."],
    ];

    test.each(negativeCases)(
        "%s",
        async (description, email, password, expectedStatus, expectedError) => {
            const response = await request(app).post("/user/login").send({ email, password });
            expect(response.status).toBe(expectedStatus);
            expect(response.body.error).toBe(expectedError);
        }
    );
});

describe("Edit User - Positive Tests", () => {
    const positiveCases: [string, { name?: string; email?: string }, number, string][] = [
        ["should edit user name with valid token", { name: "Updated Name" }, 200, "Updated Name"],
    ];

    test.each(positiveCases)(
        "%s",
        async (description, payload, expectedStatus, expectedName) => {
            const token = getUserToken(1);
            const response = await request(app).patch("/user/editUser").set("Authorization", `Bearer ${token}`).send(payload);
            expect(response.status).toBe(expectedStatus);
            expect(response.body.message.user).toHaveProperty("name", expectedName);
            expect(response.body.message).toHaveProperty("newToken");
        }
    );
});

describe("Edit User - Negative Tests", () => {
    const negativeCases: [string, Partial<{ name: string; email: string }>, number, string][] = [
        ["should return 400 if neither name nor email is provided", {}, 400, "At least one of 'name' or 'email' must be provided"],
        ["should return 409 if email is already in use", { email: "test_email@example.com" }, 409, "Email is already in use."],
    ];

    test.each(negativeCases)(
        "%s",
        async (description, payload, expectedStatus, expectedError) => {
            const token = getUserToken(2);
            const response = await request(app).patch("/user/editUser").set("Authorization", `Bearer ${token}`).send(payload);
            expect(response.status).toBe(expectedStatus);
            expect(response.body.error).toBe(expectedError);
        }
    );
});

describe("Edit Password - Positive Tests", () => {
    const positiveCases: [string, { oldPassword: string; password: string }, number, string][] = [
        ["should edit user password successfully", { oldPassword: process.env.DEFAULT_PASSWORD as string, password: "NewPassword123" }, 200, "Your password has been updated successfully."],
    ];

    test.each(positiveCases)(
        "%s",
        async (description, payload, expectedStatus, expectedMessage) => {
            const token = getUserToken(0);
            const response = await request(app).patch("/user/editPassword").set("Authorization", `Bearer ${token}`).send(payload);
            expect(response.status).toBe(expectedStatus);
            expect(response.body.message).toBe(expectedMessage);
        }
    );
});

describe("Edit Password - Negative Tests", () => {
    const negativeCases: [string, { oldPassword?: string; password?: string }, number, string][] = [
        ["should return 401 if old password is incorrect", { oldPassword: "WrongOldPassword", password: "NewPassword123" }, 401, "Old password is incorrect."],
        ["should return 422 if new password is too short", { oldPassword: process.env.DEFAULT_PASSWORD as string, password: "short" }, 422, "Password must be at least 8 characters long."],
        ["should return 400 if oldPassword or password is missing", { oldPassword: process.env.DEFAULT_PASSWORD as string }, 400, "Both 'oldPassword' and 'password' must be provided"],
        ["should return 422 if new password matches old password", { oldPassword: process.env.DEFAULT_PASSWORD as string, password: process.env.DEFAULT_PASSWORD as string }, 422, "New password must be different from old password"],
    ];

    test.each(negativeCases)(
        "%s",
        async (description, payload, expectedStatus, expectedError) => {
            const token = getUserToken(0);
            const response = await request(app).patch("/user/editPassword").set("Authorization", `Bearer ${token}`).send(payload);
            expect(response.status).toBe(expectedStatus);
            expect(response.body.error).toBe(expectedError);
        }
    );
});