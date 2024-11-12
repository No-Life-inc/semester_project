import { afterAll, beforeAll, describe, expect, it, jest, test } from "@jest/globals";

jest.setTimeout(30000); // Sets timeout to 30 seconds

import { setupTestDB, teardownTestDB } from "./setupTestDB";
import knex from "knex";
import knexConfig from "../../knexfile";
import { getBooks, getBookById, addBooks, getBooksByTitle } from "../../services/bookService";
import BookData from "../../types/bookData";
import Publisher from "../../models/sequelize/Publisher";
import Subject from "../../models/sequelize/Subject";

// Initialize Knex
const testKnex = knex(knexConfig.test);

beforeAll(async () => {
  await setupTestDB();
});

afterAll(async () => {
  await teardownTestDB();
});

describe("getBooks function positive tests", () => {
  const positiveTestCases = [
    [1, 1, 1],
    [1, 2, 2],
    [1, 100, 100],
    [1, 99, 99],
    [1, 50, 50],
    [undefined, undefined, 50], // No parameters should fetch books with page 1, limit 50
  ];

  test.each(positiveTestCases)(
    "should fetch books (page: %i, limit: %i)",
    async (page, limit, expectedLength) => {
      const books = await getBooks(page, limit);
      expect(books?.length).toBeLessThanOrEqual(expectedLength ?? 0);
    }
  );
});

describe("getBooks function negative tests", () => {
  const negativeTestCases = [
    [-1, 10, "Invalid page number. Page must be a number greater than or equal to 1."],
    [NaN, 10, "Invalid page number. Page must be a number greater than or equal to 1."],
    [1, -10, "Invalid limit. Limit must be a number greater than or equal to 1."],
    [1, NaN, "Invalid limit. Limit must be a number greater than or equal to 1."],
    [1, 101, "Invalid limit. Limit must be a number less than or equal to 100."],
  ];

  test.each(negativeTestCases)(
    "should throw an error (page: %i, limit: %i, errorMessage: %s)",
    async (page, limit, errorMessage) => {
      await expect(getBooks(Number(page), Number(limit))).rejects.toThrow(errorMessage);
    }
  );
});

describe("getBookById function positive tests", () => {
  const positiveTestCases = [
    [1],
    [2],
    [99],
    [100],
    [50],
  ];

  test.each(positiveTestCases)(
    "should fetch a book by valid id (bookId: %i)",
    async (bookId) => {
      const book = await getBookById(bookId);
      expect(book).toBeDefined();
      expect(book.id).toBe(bookId);
    }
  );
});

describe("getBookById function negative tests", () => {
  const negativeTestCases: [number, string][] = [
    [-1, "Invalid book id. Book id must be a number greater than or equal to 1."],
    [NaN, "Invalid book id. Book id must be a number greater than or equal to 1."],
    [5000, "Book not found"],
  ];

  test.each(negativeTestCases)(
    "should throw an error (bookId: %i, errorMessage: %s)",
    async (bookId: number, errorMessage: string) => {
      await expect(getBookById(bookId)).rejects.toThrow(errorMessage);
    }
  );
});

describe("addBooks function positive tests with minimal data", () => {
  const minimalDataTestCases = [
    [
      [
        {
          title: "This is the minimal amount of data required to add a book",
        },
      ]
    ],
    [
      [
        {
          title: "",
        },
      ]
    ],
    [
      [
        {
          title: "Maximal is a long text of 255 characters, and this text will be 255 characters long. Max es un texto largo de 255 caracteres, y este texto tendrá 255 caracteres. Maksimal er en tekst på 255 tegn, og denne tekst vil være på 255 tegn. Her er fyld til sidst.",
        },
      ]
    ],
    [
      [
        {
          title: "The title dont matter here",
        },
      ]
    ],
  ];

  test.each(minimalDataTestCases)(
    "should add books (booksData: %o) with minimal data without checking publisher or subject",
    async (booksData) => {
      const addedBooks = await addBooks(booksData);
      expect(addedBooks).toBeDefined();
      expect(addedBooks.length).toBe(booksData.length);

      for (let i = 0; i < booksData.length; i++) {
        expect(addedBooks[i].title).toBe(booksData[i].title);
      }
    }
  );
});

describe("BookData field boundary tests", () => {
  const maxText = "Maximal is a long text of 255 characters, and this text will be 255 characters long. Max es un texto largo de 255 caracteres, y este texto tendrá 255 caracteres. Maksimal er en tekst på 255 tegn, og denne tekst vil være på 255 tegn. Her er fyld til sidst.";
  const maxTextMinusOne = "Maximal is a long text of 255 characters, and this text will be 255 characters long. Max es un texto largo de 255 caracteres, y este texto tendrá 255 caracteres. Maksimal er en tekst på 255 tegn, og denne tekst vil være på 255 tegn. Her er fyld til sidst";

  const minimalBookData: BookData = { title: "" };

  const cases: [Partial<BookData>, string][] = [
      // Title field tests
      [{ title: "" }, "should accept minimal title"],
      [{ title: "a" }, "should accept close to minimal title"],
      [{ title: maxText }, "should accept maximal title (255 chars)"],
      [{ title: maxTextMinusOne }, "should accept close to maximal title (255 chars)"],

      // Image field tests
      [{ image: "" }, "should accept minimal image URL"],
      [{ image: "a" }, "should accept close to minimal image URL"],
      [{ image: "http://".padEnd(255, "a") }, "should accept maximal image URL (255 chars)"],
      [{ image: "http://".padEnd(254, "a") }, "should accept close to maximal image URL (254 chars)"],

      // Title_long field tests
      [{ title_long: "" }, "should accept minimal title_long"],
      [{ title_long: "a" }, "should accept close to minimal title_long"],
      [{ title_long: maxText }, "should accept maximal title_long (255 chars)"],
      [{ title_long: maxTextMinusOne }, "should accept maximal title_long (255 chars)"],

      // Date_published field tests
      [{ date_published: "" }, "should accept minimal date_published"],
      [{ date_published: " " }, "should accept minimal date_published"],
      [{ date_published: "9999-12-31" }, "should accept typical date format for date_published"],

      // Publisher field tests
      [{ publisher: "" }, "should accept minimal publisher"],
      [{ publisher: maxText }, "should accept maximal publisher (255 chars)"],

      // Synopsis field tests
      [{ synopsis: "" }, "should accept minimal synopsis"],
      [{ synopsis: maxText }, "should accept maximal synopsis (255 chars)"],

      // Subjects field tests
      [{ subjects: [] }, "should accept empty subjects array"],
      [{ subjects: [maxText] }, "should accept subjects with maximal length entry (255 chars)"],

      // Authors field tests
      [{ authors: [] }, "should accept empty authors array"],
      [{ authors: [maxText] }, "should accept authors with maximal length entry (255 chars)"],

      // ISBN13 field tests
      [{ isbn13: "" }, "should accept minimal isbn13"],
      [{ isbn13: "9999999999999" }, "should accept valid ISBN-13 (13 chars)"],

      // MSRP field tests
      [{ msrp: 0 }, "should accept minimum msrp value (0)"],
      [{ msrp: 9999.99 }, "should accept maximal msrp within limits"],

      // Edition field tests
      [{ edition: "" }, "should accept minimal edition"],
      [{ edition: maxText }, "should accept maximal edition (255 chars)"],

      // Binding field tests
      [{ binding: "" }, "should accept minimal binding"],
      [{ binding: maxText }, "should accept maximal binding (255 chars)"],

      // ISBN field tests
      [{ isbn: "" }, "should accept minimal isbn"],
      [{ isbn: "9999999999" }, "should accept valid ISBN-10 (10 chars)"],

      // ISBN10 field tests
      [{ isbn10: "" }, "should accept minimal isbn10"],
      [{ isbn10: "123456789X" }, "should accept valid ISBN-10 format"],

      // Language field tests
      [{ language: "" }, "should accept minimal language"],
      [{ language: maxText }, "should accept typical language value"],

      // Dimensions field tests
      [{ dimensions: "" }, "should accept minimal dimensions"],
      [{ dimensions: maxText }, "should accept maximal dimensions (255 chars)"],

      // Dimensions_structured field tests
      [{ dimensions_structured: { length: { value: 0, unit: "" } } }, "should accept minimal structured dimensions"],
      [{ dimensions_structured: { length: { value: 9999, unit: "centimeters" } } }, "should accept maximal structured dimensions"],

      // Pages field tests
      [{ pages: 0 }, "should accept minimum pages (0)"],
      [{ pages: 10000 }, "should accept maximal pages within limits"],

      // Publisher_id field tests
      [{ publisher_id: 0 }, "should accept minimum publisher_id (0)"],
      [{ publisher_id: 99999999 }, "should accept a high publisher_id value"]
  ];

  test.each(cases)(
      "%s",
      async (fieldData, description) => {
        const validDataArray: BookData[] = [{ ...minimalBookData, ...fieldData[0] }];
          const result = await addBooks(validDataArray);
          expect(result).toBeDefined();
          expect(result.length).toBe(validDataArray.length);
      }
  );
});

describe("addBooks function positive tests", () => {
  const positiveTestCases: [BookData[], string, string][] = [
    [
      [
        {
          title: "Test Book 1",
          publisher: "Test Publisher",
          edition: "1st",
          isbn: "1234567890",
          language: "en",
          pages: 100,
          date_published: new Date().toDateString(),
          dimensions: "8x11",
          image: "http://example.com/image1.jpg",
          synopsis: "Test synopsis 1",
          msrp: 19.99,
          isbn10: "1234567890",
          isbn13: "123-1234567890",
          binding: "Hardcover",
          subjects: ["Test Subject 1"],
          authors: ["Test Author 1"],
        },
      ],
      "Test Publisher",
      "Test Subject 1",
    ],
    [
      [
        {
          title: "Test Book 2",
          publisher: "Another Publisher",
          edition: "2nd",
          isbn: "0987654321",
          language: "en",
          pages: 200,
          date_published: new Date().toDateString(),
          dimensions: "8x11",
          image: "http://example.com/image2.jpg",
          synopsis: "Test synopsis 2",
          msrp: 29.99,
          isbn10: "0987654321",
          isbn13: "123-0987654321",
          binding: "Paperback",
          subjects: ["Another Subject"],
          authors: ["Test Author 2"],
        },
      ],
      "Another Publisher",
      "Another Subject",
    ],
    [
      [
        {
          title: "Maximal is a long text of 255 characters, and this text will be 255 characters long. Max es un texto largo de 255 caracteres, y este texto tendrá 255 caracteres. Maksimal er en tekst på 255 tegn, og denne tekst vil være på 255 tegn. Her er fyld til sidst.",
          publisher: "Minimal Publisher",
          subjects: ["Minimal Subject"],
        },
      ],
      "Minimal Publisher",
      "Minimal Subject",
    ],
    [
      [
        {
          title: "The title dont matter here",
          publisher: "a",
          subjects: ["Minimal Subject"],
        },
      ],
      "a",
      "Minimal Subject",
    ],
    [
      [
        {
          title: "The title dont matter here either",
          publisher: "Maximal is a long text of 255 characters, and this text will be 255 characters long. Max es un texto largo de 255 caracteres, y este texto tendrá 255 caracteres. Maksimal er en tekst på 255 tegn, og denne tekst vil være på 255 tegn. Her er fyld til sidst.",
          subjects: ["Minimal Subject"],
        },
      ],
      "Maximal is a long text of 255 characters, and this text will be 255 characters long. Max es un texto largo de 255 caracteres, y este texto tendrá 255 caracteres. Maksimal er en tekst på 255 tegn, og denne tekst vil være på 255 tegn. Her er fyld til sidst.",
      "Minimal Subject",
    ],
    [
      [
        {
          title: "The title dont matter here x2",
          publisher: "Minimal Publisher",
          subjects: [""],
        },
      ],
      "Minimal Publisher",
      "",
    ],
  ];

  test.each(positiveTestCases)(
    "should add books (booksData: %o) and check for publisher and subject",
    async (booksData, expectedPublisher, expectedSubject) => {
      // Perform the insertion
      const addedBooks = await addBooks(booksData);
      expect(addedBooks).toBeDefined();
      expect(addedBooks.length).toBe(booksData.length);

      // Verify each book was added with correct title
      for (let i = 0; i < booksData.length; i++) {
        expect(addedBooks[i].title).toBe(booksData[i].title);
      }

      // Check that the publisher exists in the database
      const publisher = await Publisher.findOne({ where: { name: expectedPublisher } });
      expect(publisher).toBeDefined();
      expect(publisher.name).toBe(expectedPublisher);

      // Check that the subject exists in the database
      const subject = await Subject.findOne({ where: { name: expectedSubject } });
      expect(subject).toBeDefined();
      expect(subject.name).toBe(expectedSubject);
    }
  );
});



describe("addBooks function negative tests", () => {
  const negativeTestCases: [Partial<BookData>[], string][] = [
    [
      [
        {
          publisher: "Test Publisher", // Title omitted to trigger validation error
          edition: "1st",
          isbn: "1234567890",
          language: "en",
          pages: 100,
          date_published: new Date().toDateString(),
          dimensions: "8x11",
          image: "http://example.com/image2.jpg",
          synopsis: "Test synopsis 2",
          msrp: 29.99,
          isbn10: "0987654321",
          isbn13: "123-0987654321",
          binding: "Paperback",
          subjects: ["Test Subject 2"],
          authors: ["Test Author 2"],
        },
      ],
      "notNull Violation: Book.title cannot be null",
    ],
  ];

  test.each(negativeTestCases)(
    "should throw an error (booksData: %o, errorMessage: %s)",
    async (booksData, errorMessage) => {
      await expect(addBooks(booksData as BookData[])).rejects.toThrow(errorMessage);
    }
  );
});

describe("getBooksByTitle function", () => {
  const positiveTestCases = [
    ["Scrooge", "Scrooge"],
    ["The Sentinel: A Jack Reacher Novel", "The Sentinel: A Jack Reacher Novel"],
  ];

  test.each(positiveTestCases)(
    "should return expected books when searching for title '%s'",
    async (searchTitle: string, expectedTitleSubstring: string) => {
      const books = await getBooksByTitle(searchTitle);
      
        expect(books).toBeDefined();
        expect(books.length).toBeGreaterThan(0);
        expect(books[0].title).toContain(expectedTitleSubstring);
  
    }
  );

  const negativeTestCases: [string | null, string][] = [
    ["", "Invalid title. Title must be a non-empty string."],
    [null, "Invalid title. Title must be a non-empty string."],
  ];

  test.each(negativeTestCases)(
    "should throw an error for invalid title '%s'",
    async (invalidTitle, expectedErrorMessage) => {
      await expect(getBooksByTitle(invalidTitle as any)).rejects.toThrow(expectedErrorMessage);
    }
  );
});
