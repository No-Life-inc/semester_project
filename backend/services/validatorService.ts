export const validatePassword = (password: string): void => {
    if (password.trim() === "") {
        throw new Error("Password cannot be whitespace.");
    }

    if (/\s/.test(password)) {
        throw new Error("Password cannot contain spaces.");
    }

    if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long.");
    }

    if (!/[a-z]/.test(password)) {
        throw new Error("Password must contain at least one lowercase letter.");
    }

    if (!/[A-Z]/.test(password)) {
        throw new Error("Password must contain at least one uppercase letter.");
    }

    if (!/[0-9]/.test(password)) {
        throw new Error("Password must contain at least one digit.");
    }

    if (/\s/.test(password)) {
        throw new Error("Password cannot contain a space.");
    }
};

export const validateEmail = (email: string): void => {
    if (!email || email.trim() === "") {
        throw new Error("Email cannot be empty or whitespace.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Invalid email format.");
    }
}
