import {
    afterAll,
    beforeAll,
    describe,
    expect,
    it,
    jest,
    test,
  } from "@jest/globals";
  
jest.setTimeout(120000);

import { fetchBooksFromExternalAPI } from "../../services/externalAPIService";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("fetchBooksFromExternalAPI Positive tests", () => {
    const testCases = [
      ["twillight", 3], 
      ["Jeffy", 18], 
      [-1, 10000], 
      [0, 8155],
    ];
  
    test.each(testCases)(
      "should fetch books for title: %s",
      async (title: string | number, expectedMaxBooks: string | number) => {
        
        const books = await fetchBooksFromExternalAPI(String(title));
  
        expect(Array.isArray(books)).toBe(true);
        expect(books.length).toBeLessThanOrEqual(Number(expectedMaxBooks));
  
        books.forEach((book) => {
            expect(typeof book.title).toBe("string");
            expect(book.title).not.toBe("");
            expect(typeof book.isbn).toBe("string");
            expect(book.isbn).not.toBe("");
          });

        await delay(1000);
      }
    );
  });

describe("fetchBooksFromExternalAPI Negative tests", () => {
  const maxTextPlusOne = "Maximal is a long text of 255 characters, and this text will be 255 characters long. Max es un texto largo de 255 caracteres, y este texto tendrá 255 caracteres. Maksimal er en tekst på 255 tegn, og denne tekst vil være på 255 tegn. Her er fyld til sidst.-";


    const testCases: [string, string, number | string, number][] = [
      ["ZZZZZZZZZZZZ", "Request failed with status code 404", "ERR_BAD_REQUEST", 404],
      ["", "Request failed with status code 403", "ERR_BAD_REQUEST", 403],
      [maxTextPlusOne, "Request failed with status code 404", "ERR_BAD_REQUEST", 404],

    ];
  
    test.each(testCases)(
      "should return an error message when the search term is %s",
      async (title, expectedErrorMessage, code, statuscode) => {
        try {
          await fetchBooksFromExternalAPI(title);
        } catch (error) {
          
          expect(error.message).toBe(expectedErrorMessage);
          expect(error.code).toBe(code);
          expect(error.status).toBe(statuscode);
        }
  
        await delay(1000);
      }
    );
  });