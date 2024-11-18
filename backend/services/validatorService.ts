export const validatePassword = (password: string): void => {
    if (!password || password.trim() === "") {
        throw new Error("Password cannot be empty or whitespace.");
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
};

export const validateEmail = (email: string): void => {
    if (!email || email.trim() === "") {
        throw new Error("Email cannot be empty or whitespace.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Invalid email format.");
    }
}
