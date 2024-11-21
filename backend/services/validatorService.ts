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
};

export const validateEmail = (email: string): void => {
    if (!email || email.trim() === "") {
        throw new Error("Email cannot be empty or whitespace.");
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        throw new Error("Invalid email format.");
    }

    if (email.length > 255) {
        throw new Error("Email cannot be more than 255 characters long.");
    }
}

export const validateName = (name: string): void => {

    if (!name || name.trim() === "") {
        throw new Error("Name cannot be empty or whitespace.");
    }

    if (name.length < 2) {
        throw new Error("Name must be at least 2 characters long.");
    }

    if (name.length > 255) {
        throw new Error("Name cannot be more than 255 characters long.");
    }

    if (!/^[a-zA-Z\s'’-]+$/.test(name)) {
        throw new Error("Invalid characters in name.");
    }

}
