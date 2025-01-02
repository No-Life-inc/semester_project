import {
    afterAll,
    beforeAll,
    describe,
    expect,
    jest,
    test,
} from "@jest/globals";
import request from "supertest";
import express from "express";
import userRouter from "../../routes/V1/userRoutes";

import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";
import {getUserToken, teardownUserSetup, userSetup} from "../utility/userSetup";

jest.setTimeout(120000);

const app = express();
app.use(express.json());
app.use("/user", userRouter);
const testEmail = "test@test.com"

beforeAll(async () => {
    await setupTestDB();
    await userSetup();
});

afterAll(async () => {
    await teardownTestDB();
    await teardownUserSetup();
});

describe("User Routes - Register - Positive tests", () => {
    test("should register a new user with valid name, email and password", async () => {
        const response = await request(app)
            .post("/user/register")
            .send({
                name: "New User",
                email: "newuser@example.com",
                password: "Password123",
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("name", "New User");
        expect(response.body).toHaveProperty("email", "newuser@example.com");
        expect(response.body).not.toHaveProperty("password");
    });
});

describe("User Routes - Register - Negative tests", () => {
    test("should return 500 if email is already in use", async () => {
        const response = await request(app)
            .post("/user/register")
            .send({
                name: "Existing User",
                email: testEmail,
                password: "SomePass123",
            });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Email is already in use.");
    });

    test("should return 500 if invalid email is provided", async () => {
        const response = await request(app)
            .post("/user/register")
            .send({
                name: "Bad Email User",
                email: "notAnEmail",
                password: "Password123",
            });

        expect(response.status).toBe(500);
        expect(response.body.error).toBeDefined();
    });

    test("should return 500 if no password is provided", async () => {
        const response = await request(app)
            .post("/user/register")
            .send({
                name: "No Password",
                email: "nopassword@example.com",
            });

        expect(response.status).toBe(500);
        expect(response.body.error).toBeDefined();
    });
});

describe("User Routes - Login - Positive tests", () => {
    test("should log in user with valid credentials", async () => {
        const response = await request(app)
            .post("/user/login")
            .send({
                email: testEmail,
                password: process.env.DEFAULT_PASSWORD
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("user");
        expect(response.body).toHaveProperty("token");
    });
});

describe("User Routes - Login - Negative tests", () => {
    test("should return 500 if email is invalid", async () => {
        const response = await request(app)
            .post("/user/login")
            .send({
                email: "invalidEmail@example.com",
                password: process.env.DEFAULT_PASSWORD
            });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Invalid email or password.");
    });

    test("should return 500 if password is incorrect", async () => {
        const response = await request(app)
            .post("/user/login")
            .send({
                email: testEmail,
                password: "WrongPassword",
            });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Invalid email or password.");
    });
});

describe("User Routes - Edit User - Positive tests", () => {
    test("should edit user name with valid token and new name", async () => {
        const token = getUserToken(0);
        const response = await request(app)
            .patch("/user/editUser")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Updated Name",
            });

        expect(response.status).toBe(200);
        // Check if message or user object is returned
        expect(response.body).toHaveProperty("message");
    });
});

describe("User Routes - Edit User - Negative tests", () => {
    test("should return 400 if neither name nor email is provided", async () => {
        const token = getUserToken(0);

        const response = await request(app)
            .patch("/user/editUser")
            .set("Authorization", `Bearer ${token}`)
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("At least one of 'name' or 'email' must be provided");
    });

    test("should return 500 if token is missing or invalid", async () => {
        const response = await request(app)
            .patch("/user/editUser")
            .send({ name: "Should Fail" });

        expect([401, 403, 500]).toContain(response.status);
    });
});

describe("User Routes - Edit Password - Positive tests", () => {
    test("should edit user password with valid oldPassword", async () => {
        const token = getUserToken(0);

        const response = await request(app)
            .patch("/user/editPassword")
            .set("Authorization", `Bearer ${token}`)
            .send({
                oldPassword: process.env.DEFAULT_PASSWORD,
                password: "NewPass1234",
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "Your password has been updated successfully.");
    });
});

describe("User Routes - Edit Password - Negative tests", () => {
    test("should return 400 if oldPassword or new password is missing", async () => {
        const token = getUserToken(0);

        const response = await request(app)
            .patch("/user/editPassword")
            .set("Authorization", `Bearer ${token}`)
            .send({
                oldPassword: "Password123",
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Both 'oldPassword' and 'password' must be provided");
    });

    test("should return 400 if oldPassword and new password are the same", async () => {
        const token = getUserToken(0);

        const response = await request(app)
            .patch("/user/editPassword")
            .set("Authorization", `Bearer ${token}`)
            .send({
                oldPassword: process.env.DEFAULT_PASSWORD,
                password: process.env.DEFAULT_PASSWORD,
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("New password must be different from old password");
    });

    test("should return 500 if oldPassword is incorrect", async () => {
        const token = getUserToken(0);
        const response = await request(app)
            .patch("/user/editPassword")
            .set("Authorization", `Bearer ${token}`)
            .send({
                oldPassword: "WrongOldPassword",
                password: "NewPass456",
            });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Invalid password.");
    });
});
