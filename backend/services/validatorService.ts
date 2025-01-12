import {ValidationError} from "../utility/errors";

export const validatePassword = (password: string): void => {

    if (password === null || password === undefined) {
        throw new ValidationError("Password cannot be null or undefined.");
    }

    if (typeof password !== "string" || password.trim() === "") {
        throw new ValidationError("Password cannot be empty or whitespace.");
    }

    if (/\s/.test(password)) {
        throw new ValidationError("Password cannot contain spaces.");
    }

    if (password.length < 8) {
        throw new ValidationError("Password must be at least 8 characters long.");
    }

    if (password.length > 128) {
        throw new ValidationError("Password cannot exceed 128 characters.");
    }

    if (!/[a-z]/.test(password)) {
        throw new ValidationError("Password must contain at least one lowercase letter.");
    }

    if (!/[A-Z]/.test(password)) {
        throw new ValidationError("Password must contain at least one uppercase letter.");
    }

    if (!/[0-9]/.test(password)) {
        throw new ValidationError("Password must contain at least one digit.");
    }

};

export const validateEmail = (email: string): void => {
    if (email === null || email === undefined) {
        throw new ValidationError("Email cannot be null or undefined.");
    }

    if (typeof email !== "string" || email.trim() === "") {
        throw new ValidationError("Email cannot be empty or whitespace.");
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        throw new ValidationError("Invalid email format.");
    }

    if (email.length > 255) {
        throw new ValidationError("Email cannot be more than 255 characters long.");
    }
}

export const validateName = (name: string): void => {

    if (name === null || name === undefined) {
        throw new ValidationError("Name cannot be null or undefined.");
    }

    if (typeof name !== "string" || name.trim() === "") {
        throw new ValidationError("Name cannot be empty or whitespace.");
    }
    if (name.length < 2) {
        throw new ValidationError("Name must be at least 2 characters long.");
    }

    if (name.length > 255) {
        throw new ValidationError("Name cannot be more than 255 characters long.");
    }

    if (!/^[a-zA-Z\s'’-]+$/.test(name)) {
        throw new ValidationError("Invalid characters in name.");
    }
}
