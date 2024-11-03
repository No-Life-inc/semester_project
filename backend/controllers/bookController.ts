import { Request, Response } from "express";
import Book from "../models/sequelize/Book"; // Adjust the path to your Book model

export const getBooks = async (page: number = 1, limit: number = 50) => {
    /**
   * getBooks parameters:
   * - page: The page number to fetch (default: 1)
   * - limit: The number of records to fetch per page (default: 50)
   *
   * Example: getBooks(1, 50) or getBooks()
   *
   * This will fetch the first 50 books from the database
   *
   */

    if (page === undefined) {
        page = 1;
    }

    if (limit === undefined) {
        limit = 50;
    }

    // Validate page and limit
    if (isNaN(page) || page < 1) {
        throw new Error("Invalid page number. Page must be a number greater than or equal to 1.");
    }

    if(isNaN(limit) || limit < 1) {
        throw new Error("Invalid limit. Limit must be a number greater than or equal to 1.");
    }

    if (limit > 100) {
        throw new Error("Invalid limit. Limit must be a number less than or equal to 100.");
    }
  
    const offset = (Number(page) - 1) * Number(limit);
  
    try {
      const books = await Book.findAll({
        offset,
        limit: Number(limit),
      });
     return books;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  };

export const getBookById = async (id: number) => {

    /**
   * getBookById parameters:
   * - id: The ID of the book to fetch
   *
   * Example: getBookById(1)
   *
   * This will fetch the book with ID 1
   */

    try {
        if (isNaN(id) || id < 1) {
            throw new Error("Invalid book id. Book id must be a number greater than or equal to 1.");
        }

        const book = await Book.findByPk(id);
        
        if (!book) {
            throw new Error("Book not found");
        }

        return book;
    } catch (error) {
        console.error("Error fetching book by id:", error);
        throw error;
    }
}