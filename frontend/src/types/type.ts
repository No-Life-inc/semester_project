export interface Book {
    id?: number;
    title: string;
    publisherId?: number;
    edition?: number;
    coverId?: number;
    isbn?: string;
    language?: string;
    pages?: number;
    publicationDate?: Date;
    dimensions?: string;
    image?: string;
    synopsis?: string;
    msrp?: number;
    isbn10?: string;
    isbn13?: string;
    binding?: string;
    users?: User[]; // Add users property for TypeScript
    authors?: Author[]; // Add authors property for TypeScript
    subjects?: Subject[]; // Add subjects property for TypeScript
    publisher?: Publisher; // Add publisher property for TypeScript
}

// Define the related interfaces if not already defined
export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Author {
    id: number;
    name: string;
    // Add other author attributes as needed
}

export interface Publisher {
    id: number;
    name: string;
    // Add other publisher attributes as needed
}

export interface Subject {
    id: number;
    name: string;
    // Add other subject attributes as needed
}