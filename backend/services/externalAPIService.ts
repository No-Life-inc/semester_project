import axios from "axios";
import dotenv from "dotenv";
import BookData from "../types/bookData";

dotenv.config();

/**
 * Fetches books from an external API by title.
 * 
 * @param {string} title - The title to search for.
 * @returns {Promise<object[]>} - A promise that resolves to an array of book objects.
 * 
 * @example
 * fetchBooksFromExternalAPI("Harry")
 * // This will fetch books with titles containing "Harry" from the external API.
 */
export const fetchBooksFromExternalAPI = async (title: string): Promise<BookData[]> => {
    try {
        const headers = {
            "Authorization": `${process.env.ISBNDB_API_KEY}`,
            "Content-Type": "application/json"
        };
        const apiResponse = await axios.get<{ books: BookData[] }>(
            `https://api2.isbndb.com/books/${title}?page=1&pageSize=20&column=title&shouldMatchAll=0`,
            { headers }
        );
        return apiResponse.data.books;
    } catch (error) {
        console.error("Error fetching books from external API:", error);
        throw error;
    }
};