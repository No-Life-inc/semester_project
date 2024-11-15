import axios from "axios";
import dotenv from "dotenv";
import BookAPIData from "../types/bookAPIData";

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
export const fetchBooksFromExternalAPI = async (title: string): Promise<BookAPIData[]> => {
    try {
        const headers = {
            "Authorization": `${process.env.ISBNDB_API_KEY}`,
            "Content-Type": "application/json"
        };
        const apiResponse = await axios.get<{ books: BookAPIData[] }>(
            `https://api2.isbndb.com/books/${title}?page=1&pageSize=20&column=title&shouldMatchAll=0`,
            { headers }
        );
        return apiResponse.data.books;
    } catch (error) {
        throw error;
    }
};