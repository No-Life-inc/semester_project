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

import { setupTestDB, teardownTestDB } from "../../database/knex/setupTestDB";
import {
  getBooks,
  getBookById,
  addBooks,
  getBooksByTitle,
} from "../../services/bookService";
import BookAPIData from "../../types/bookAPIData";
import Book from "../../models/sequelize/Book";

import { NotFoundError, ValidationError } from "../../utility/errors";

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
    [undefined, undefined, 50], 
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
    [
      -1,
      10,
      "Invalid page number. Page must be a number greater than or equal to 1.",
      ValidationError,
    ],
    [
      -2,
      10,
      "Invalid page number. Page must be a number greater than or equal to 1.",
      ValidationError,
    ],
    [
      NaN,
      10,
      "Invalid page number. Page must be a number greater than or equal to 1.",
      ValidationError,
    ],
    [
      0,
      10,
      "Invalid page number. Page must be a number greater than or equal to 1.",
      ValidationError,
    ],
    [
      1,
      -10,
      "Invalid limit. Limit must be a number greater than or equal to 1.",
      ValidationError,
    ],
    [
      1,
      NaN,
      "Invalid limit. Limit must be a number greater than or equal to 1.",
      ValidationError,
    ],
    [
      1,
      101,
      "Invalid limit. Limit must be a number less than or equal to 100.",
      ValidationError,
    ],
    [
      1,
      102,
      "Invalid limit. Limit must be a number less than or equal to 100.",
      ValidationError,
    ],
    [
      1,
      0,
      "Invalid limit. Limit must be a number greater than or equal to 1.",
      ValidationError,
    ],
  ];

  test.each(negativeTestCases)(
    "should throw an error (page: %i, limit: %i, errorMessage: %s)",
    async (page, limit, errorMessage, err) => {
      await expect(getBooks(Number(page), Number(limit))).rejects.toThrow(
        errorMessage
      );
      await expect(getBooks(Number(page), Number(limit))).rejects.toThrow(err);
    }
  );
});

describe("getBookById function positive tests", () => {
  const positiveTestCases = [[1], [2], [99], [100], [50]];

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
  const negativeTestCases = [
    [
      -1,
      "Invalid book id. Book id must be a number greater than or equal to 1.",
      ValidationError,
    ],
    [
      -2,
      "Invalid book id. Book id must be a number greater than or equal to 1.",
      ValidationError,
    ],
    [
      NaN,
      "Invalid book id. Book id must be a number greater than or equal to 1.",
      ValidationError,
    ],
    [
      null,
      "Invalid book id. Book id must be a number greater than or equal to 1.",
      ValidationError,
    ],
    [
      undefined,
      "Invalid book id. Book id must be a number greater than or equal to 1.",
      ValidationError,
    ],
    [
      5000, 
      "Book not found",
      NotFoundError
    ],
    [
      0,
      "Invalid book id. Book id must be a number greater than or equal to 1.",
      ValidationError,
    ],
    [
      "1" as any,
      "Invalid book id. Book id must be a number greater than or equal to 1.",
      ValidationError,
    ],
  ];

  test.each(negativeTestCases)(
    "should throw an error (bookId: %i, errorMessage: %s)",
    async (bookId: any, errorMessage: string, err: ValidationError | NotFoundError) => {
      await expect(getBookById(bookId)).rejects.toThrow(errorMessage);
      await expect(getBookById(bookId)).rejects.toThrow(err);
    }
  );
});


describe("BookData field boundary positive tests", () => {

  const minimalBookData: BookAPIData = { title: " " };

  const cases: [Partial<BookAPIData>, keyof Book, any, string][] = [
    [{ isbn: "1234567889" }, "title", " ", "should accept minimal valid title"],
    [{ title: "A", isbn: "1234567890" }, "title", "A", "should accept minimal valid title"],
    [{ title: "AA", isbn: "91234567890" }, "title", "AA", "should accept minimal valid title"],
    [{ title: "Default Title", isbn: "1234567888" }, "title", "Default Title", "should accept a middle valid title"],
    [{ title: "A".repeat(255), isbn: "1234567891" }, "title", "A".repeat(255), "should accept maximal title (255 chars)"],
    [{ title: "A".repeat(254), isbn: "1234567892" }, "title", "A".repeat(254), "should accept title one character below limit"],

    // Image field tests
    [{ image: "", isbn: "1234567893" }, "image", "", "should accept minimal image URL"],
    [{ image: "a", isbn: "1234567894" }, "image", "a", "should accept close to minimal image URL"],
    [{ image: "aa", isbn: "91234567894" }, "image", "aa", "should accept close to minimal image URL"],
    [{ image: "http://".padEnd(140, "a"), isbn: "1234567895" }, "image", "http://".padEnd(140, "a"), "should accept a middle image URL"],
    [{ image: "http://".padEnd(255, "a"), isbn: "0000000006" }, "image", "http://".padEnd(255, "a"), "should accept maximal image URL (255 chars)"],
    [{ image: "http://".padEnd(254, "a"), isbn: "1234567896" }, "image", "http://".padEnd(254, "a"), "should accept close to maximal image URL (254 chars)"],

    // Title_long field tests
    [{ title_long: "", isbn: "0000000001" }, "titleLong", "", "should accept minimal title_long"],
    [{ title_long: "a", isbn: "0000000002" }, "titleLong", "a", "should accept close to minimal title_long"],
    [{ title_long: "aa", isbn: "90000000002" }, "titleLong", "aa", "should accept close to minimal title_long"],
    [{ title_long: "Default Title", isbn: "0000000005" }, "titleLong", "Default Title", "should accept a middle title_long"],
    [{ title_long: "A".repeat(255), isbn: "0000000003" }, "titleLong", "A".repeat(255), "should accept maximal title_long (255 chars)"],
    [{ title_long: "A".repeat(254), isbn: "0000000004" }, "titleLong", "A".repeat(254), "should accept maximal title_long (255 chars)"],

    // Date_published field tests
    [{ date_published: '0001-01-01', isbn: "0000000007" }, "publicationDate", '0001-01-01', "should accept minimal date_published"],
    [{ date_published: '0001-01-02', isbn: "0000000010" }, "publicationDate", '0001-01-02', "should accept close to minimal date_published"],
    [{ date_published: "9999-12-29", isbn: "0000000011" }, "publicationDate", "9999-12-29", "should accept close to max date format for date_published"],
    [{ date_published: "9999-12-30", isbn: "0000000008" }, "publicationDate", "9999-12-30", "should accept max date format for date_published"],
    [{ date_published: "2024-11-15", isbn: "0000000012" }, "publicationDate", "2024-11-15", "should accept typical date format for date_published"],

    //Synopsis field tests
    [{ synopsis: "", isbn: "0000000014" }, "synopsis", "", "should accept minimal synopsis"],
    [{ synopsis: " ", isbn: "0000000015" }, "synopsis", " ", "should accept minimal synopsis"],
    [{ synopsis: " A", isbn: "90000000015" }, "synopsis", " A", "should accept close to minimal synopsis"],
    [{ synopsis: "A".repeat(65535), isbn: "0000000013" }, "synopsis", "A".repeat(65535), "should accept maximal synopsis (max length string)"],
    [{ synopsis: "A".repeat(65534), isbn: "0000099913" }, "synopsis", "A".repeat(65534), "should accept close to maximal synopsis (max length string)"],
    [{ synopsis: "Test synopsis", isbn: "0000000017" }, "synopsis", "Test synopsis", "should accept a middle synopsis"],

    //isbn13 field tests
    [{ isbn13: "", isbn: "0000000018" }, "isbn13", "", "should accept minimal isbn13"],
    [{ isbn13: " ", isbn: "0000000020" }, "isbn13", " ", "should accept close to minimum ISBN-13 (1 chars)"],
    [{ isbn13: " A", isbn: "90000000020" }, "isbn13", " A", "should accept close to minimum ISBN-13 (2 chars)"],
    [{ isbn13: "9999999999999", isbn: "0000000019" }, "isbn13", "9999999999999", "should accept max ISBN-13 (13 chars)"],
    [{ isbn13: "999999999999", isbn: "0000000022" }, "isbn13", "999999999999", "should accept close to max ISBN-13 (12 chars)"],
    [{ isbn13: "12345678", isbn: "0000000021" }, "isbn13", "12345678", "should accept a middle ISBN-13 (8 chars)"],

    //edition field tests
    [{ edition: "", isbn: "0000000023" }, "edition", "", "should accept minimal edition"],
    [{ edition: "a", isbn: "0000000024" }, "edition", "a", "should accept close to minimal edition"],
    [{ edition: "aa", isbn: "90000000024" }, "edition", "aa", "should accept close to minimal edition"],
    [{ edition: "A".repeat(255), isbn: "0000000025" }, "edition", "A".repeat(255), "should accept maximal edition (255 chars)"],
    [{ edition: "A".repeat(254), isbn: "0000000026" }, "edition", "A".repeat(254), "should accept maximal edition (255 chars)"],
    [{ edition: "Default Edition", isbn: "0000000027" }, "edition", "Default Edition", "should accept a middle edition"],

    //binding field tests
    [{ binding: "", isbn: "0000000028" }, "binding", "", "should accept minimal binding"],
    [{ binding: "a", isbn: "0000000029" }, "binding", "a", "should accept close to minimal binding"],
    [{ binding: "aa", isbn: "90000000029" }, "binding", "aa", "should accept close to minimal binding"],
    [{ binding: "A".repeat(255), isbn: "0000000030" }, "binding", "A".repeat(255), "should accept maximal binding (255 chars)"],
    [{ binding: "A".repeat(254), isbn: "0000000031" }, "binding", "A".repeat(254), "should accept maximal binding (255 chars)"],
    [{ binding: "Default Binding", isbn: "0000000032" }, "binding", "Default Binding", "should accept a middle binding"],

    //language field tests
    [{ language: "", isbn: "0000000033" }, "language", "", "should accept minimal language"],
    [{ language: "a", isbn: "0000000034" }, "language", "a", "should accept close to minimal language"],
    [{ language: "aa", isbn: "90000000034" }, "language", "aa", "should accept close to minimal language"],
    [{ language: "A".repeat(255), isbn: "0000000035" }, "language", "A".repeat(255), "should accept maximal language (255 chars)"],
    [{ language: "A".repeat(254), isbn: "0000000036" }, "language", "A".repeat(254), "should accept language binding (255 chars)"],
    [{ language: "Default language", isbn: "0000000037" }, "language", "Default language", "should accept a middle language"],

    //dimensions field tests
    [{ dimensions: "", isbn: "0000000038" }, "dimensions", "", "should accept minimal dimensions"],
    [{ dimensions: "a", isbn: "0000000039" }, "dimensions", "a", "should accept close to minimal dimensions"],
    [{ dimensions: "aa", isbn: "90000000039" }, "dimensions", "aa", "should accept close to minimal dimensions"],
    [{ dimensions: "A".repeat(255), isbn: "0000000040" }, "dimensions", "A".repeat(255), "should accept maximal dimensions (255 chars)"],
    [{ dimensions: "A".repeat(254), isbn: "0000000041" }, "dimensions", "A".repeat(254), "should accept maximal dimensions (255 chars)"],
    [{ dimensions: "Default dimensions", isbn: "0000000042" }, "dimensions", "Default dimensions", "should accept a middle dimensions"],

    //isbn10 field tests
    [{ isbn10: "", isbn: "0000000043" }, "isbn10", "", "should accept minimal isbn10"],
    [{ isbn10: " ", isbn: "0000000044" }, "isbn10", " ", "should accept close to minimal isbn10"],
    [{ isbn10: "12", isbn: "90000000044" }, "isbn10", "12", "should accept close to minimal isbn10"],
    [{ isbn10: "1234567890", isbn: "0000000045" }, "isbn10", "1234567890", "should accept middle isbn10 (10 chars)"],
    [{ isbn10: "123456789", isbn: "0000000046" }, "isbn10", "123456789", "should accept close to max isbn10 (10 chars)"],
    [{ isbn10: "9999999999", isbn: "0000000047" }, "isbn10", "9999999999", "should accept maximal isbn10 (10 chars)"],

    //pages field tests
    [{ pages: 0, isbn: "0000000048" }, "pages", 0, "should accept minimal pages"],
    [{ pages: 1, isbn: "0000000049" }, "pages", 1, "should accept close to minimal pages"],
    [{ pages: 100, isbn: "0000000050" }, "pages", 100, "should accept middle pages"],
    [{ pages: 9999, isbn: "0000000051" }, "pages", 9999, "should accept some large page number"],
    [{ pages: 2147483647, isbn: "0000000052" }, "pages", 2147483647, "should accept maximal pages (INT_MAX)"],
    [{ pages: 2147483646, isbn: "00000099953" }, "pages", 2147483646, "should accept maximal pages (INT_MAX)"],

    //msrp field tests
    [{ msrp: 0, isbn: "0000000053" }, "msrp", 0, "should accept minimal msrp"],
    [{ msrp: 1, isbn: "0000000054" }, "msrp", 1, "should accept close to minimal msrp"],
    [{ msrp: 100, isbn: "0000000055" }, "msrp", 100, "should accept middle msrp value"],
    [{ msrp: 9999, isbn: "0000000056" }, "msrp", 9999, "should accept a large msrp value"],
    [{ msrp: 99999999.98, isbn: "0000000057" }, "msrp", 99999999.98, "should accept maximal msrp (INT_MAX)"],

    //isbn field tests
    [{ isbn: "1" }, "isbn", "1", "should accept minimal isbn10 length"],
    [{ isbn: "12" }, "isbn", "12", "should accept close to minimal isbn10 length"],
    [{ isbn: "111100018123" }, "isbn", "111100018123", "should accept maximum ISBN length (13 chars)"],
    [{ isbn: "11110001812" }, "isbn", "11110001812", "should accept close to maximum ISBN length (12 chars)"],
    [{ isbn: "11110001" }, "isbn", "11110001", "should accept middle ISBN length (8 chars)"],

  ];

  test.each(cases)(
    "%s",
    async (fieldData, fieldToCheck, expectedValue, description) => {
      
      const validDataArray: BookAPIData[] = [{...minimalBookData, ...fieldData }];
    ;

     
      const result = await addBooks(validDataArray);

     
      expect(result).toBeDefined();
      expect(result.length).toBe(validDataArray.length);

      
      result.forEach((book) => {
        expect(book[fieldToCheck]).toEqual(expectedValue);
        expect(book.id).toBeDefined();
        expect(book.createdAt).toBeDefined();
      });
    }
  );
});

describe("BookData field boundary negative tests", () => {
  const minimalBookData: BookAPIData = { title: " " };

  const cases: [Partial<BookAPIData>, string, string][] = [
    // Title field tests
    [{ title: "A".repeat(256), isbn: "1100000057" }, "Validation error: Validation len on title failed", "should reject title exceeding 255 characters"],
    [{ title: undefined, isbn: "1100000057" }, "notNull Violation: Book.title cannot be null", "should reject undefined title"],
    [{ title: null, isbn: "1100000057" }, "notNull Violation: Book.title cannot be null", "should reject null title"],

    // Image field tests
    [{ image: "A".repeat(256), isbn: "1100000057" }, "Validation error: Validation len on image failed", "should reject image URL exceeding 255 characters"],

    // Title_long field tests
    [{ title_long: "A".repeat(256), isbn: "1100000057" }, "Validation error: Validation len on titleLong failed", "should reject title_long exceeding 255 characters"],

    // Date_published field tests
    [{ date_published: "10000-01-01", isbn: "1100000057" }, "Validation error: Validation isBefore on publicationDate failed", "should reject invalid date_published beyond 9999-12-31"],
    [{ date_published: "0000-00-00", isbn: "1100000057" }, "Validation error: Validation isDate on publicationDate failed", "should reject invalid date_published of 0001-01-00"],
    [{ date_published: "9999-12-31", isbn: "1100000057" }, "Validation error: Validation isBefore on publicationDate failed", "should reject invalid date_published of 9999-12-31"],
    [{ date_published: "9999-12-32", isbn: "1100000057" }, "Validation error: Validation isDate on publicationDate failed", "should reject invalid date_published of 9999-12-32"],

    // ISBN fields
    [{ isbn10: "12345678901" }, "Validation error: Validation notEmpty on isbn failed", "should reject isbn10 exceeding 10 characters"],
    [{ isbn10: "" }, "Validation error: Validation notEmpty on isbn failed", "should reject isbn10 exceeding 10 characters"],
    [{ isbn13: "12345678901234" }, "Validation error: Validation notEmpty on isbn failed", "should reject isbn13 exceeding 13 characters"],
    [{ isbn: "12345678901234" }, "Validation error: Validation len on isbn failed", "should reject isbn exceeding 10 characters"],
    [{ isbn: undefined }, "Validation error: Validation notEmpty on isbn failed", "should reject undefined isbn"],
    [{ isbn: "" }, "Validation error: Validation notEmpty on isbn failed", "should reject empty isbn"],
    [{ isbn: null }, "Validation error: Validation notEmpty on isbn failed", "should reject null isbn"],

    // Pages field tests
    [{ pages: -1, isbn: "1100000057" }, "Validation error: Validation min on pages failed", "should reject negative pages value"],
    [{ pages: 2147483647 + 1, isbn: "1100000057" }, "Validation error: Validation max on pages failed", "should reject pages exceeding INT_MAX"],
    [{ pages: -2147483648, isbn: "1100000057" }, "Validation error: Validation min on pages failed", "should reject pages below INT_MIN"],
 
    // MSRP field tests
    [{ msrp: 100000000.0, isbn: "1100000057" }, "Validation error: Validation max on msrp failed", "should reject msrp exceeding valid max value"],
    [{ msrp: -1, isbn: "1100000057" }, "Validation error: Validation min on msrp failed", "should reject negative msrp value"],

    // Other field tests
    [{ binding: "A".repeat(256), isbn: "1100000057" }, "Validation error: Validation len on binding failed", "should reject binding exceeding 255 characters"],
    [{ dimensions: "A".repeat(256), isbn: "1100000057" }, "Validation error: Validation len on dimensions failed", "should reject dimensions exceeding 255 characters"],
    [{ language: "A".repeat(256), isbn: "1100000057" }, "Validation error: Validation len on language failed", "should reject language exceeding 255 characters"],
  ];

  test.each(cases)(
    "%s",
    async (fieldData, expectedError, description) => {
      const invalidDataArray: BookAPIData[] = [{ ...minimalBookData, ...fieldData }];

      // Assertion for specific error message
      await expect(addBooks(invalidDataArray)).rejects.toThrow(expectedError);
    }
  );
});


describe("BookData field associations - Authors", () => {
  const minimalBookData: BookAPIData = { title: "Test Book" };

  const cases: [Partial<BookAPIData>, keyof Book, any, string][] = [
    [{ authors: ["Author 1", "Author 2"], isbn: "0000000058" }, "authors", ["Author 1", "Author 2"], "should correctly associate multiple authors"],
    [{ authors: ["Author 3"], isbn: "0000000060" }, "authors", ["Author 3"], "should correctly associate a single author"],
    [{ authors: [" "], isbn: "0000000160" }, "authors", [" "], "should correctly associate a single author"],
    [{ authors: [""], isbn: "0000000162" }, "authors", [" "], "should correctly associate a single author"],
  ];

  test.each(cases)(
    "%s",
    async (fieldData, fieldToCheck, expectedValue, description) => {
      const validDataArray: BookAPIData[] = [{ ...minimalBookData, ...fieldData }];

      const result = await addBooks(validDataArray);
      expect(result).toBeDefined();
      expect(result.length).toBe(validDataArray.length);

      await Promise.all(result.map(async (book) => {
        expect(book.id).toBeDefined();
        expect(book.createdAt).toBeDefined();

        const bookWithAuthors = await Book.findOne({
          where: { id: book.id },
          include: ["authors"],
        });

        if (bookWithAuthors) {
          expectedValue.forEach((authorName) => {
            expect(bookWithAuthors.authors.map((author) => author.name)).toContain(authorName);
          });
        } 
      }));
    }
  );
});

describe("BookData field associations - Authors (Negative Tests)", () => {
  const minimalBookData: BookAPIData = { title: "Test Book" };

  const cases: [Partial<BookAPIData>, string, string][] = [
    [
      { authors: ["A".repeat(256)], isbn: "0000000101" },
      "should reject author names longer than 255 characters",
      "Validation error: Validation len on name failed",
    ],
    [
      { authors: ["1"], isbn: "0000000102" },
      "should reject numeric author names",
      "Validation error: Name cannot consist of numbers only.",
    ],
    [
      { authors: ["-1"], isbn: "0000000103" },
      "should reject negative numeric author names",
      "Validation error: Name cannot consist of numbers only.",
    ],
    [
      { authors: [undefined as any], isbn: "0000000107" },
      "should reject undefined author names",
      "WHERE parameter \"name\" has invalid \"undefined\" value",
    ],
    [
      { authors: ["2147483647"], isbn: "0000000108" },
      "should reject excessively large numeric strings as author names",
      "Validation error: Name cannot consist of numbers only.",
    ],
    [
      { authors: ["-2147483648"], isbn: "0000000109" },
      "should reject excessively negative numeric strings as author names",
      "Validation error: Name cannot consist of numbers only.",
    ],
  ];

  test.each(cases)(
    "%s",
    async (fieldData, description, expectedError) => {
      const invalidDataArray: BookAPIData[] = [{ ...minimalBookData, ...fieldData }];

      await expect(addBooks(invalidDataArray)).rejects.toThrow(expectedError);
    }
  );
});
    

describe("BookData field associations - Subjects", () => {
  const minimalBookData: BookAPIData = { title: "Test Book" };

  const cases: [Partial<BookAPIData>, keyof Book, any, string][] = [
    [{ subjects: ["Subject 1", "Subject 2"], isbn: "0000000059" }, "subjects", ["Subject 1", "Subject 2"], "should correctly associate multiple subjects"],
    [{ subjects: ["Subject 3"], isbn: "0000000061" }, "subjects", ["Subject 3"], "should correctly associate a single subject"],
  ];

  test.each(cases)(
    "%s",
    async (fieldData, fieldToCheck, expectedValue, description) => {
      const validDataArray: BookAPIData[] = [{ ...minimalBookData, ...fieldData }];

      const result = await addBooks(validDataArray);
      expect(result).toBeDefined();
      expect(result.length).toBe(validDataArray.length);

      await Promise.all(result.map(async (book) => {
        expect(book.id).toBeDefined();
        expect(book.createdAt).toBeDefined();

        const bookWithSubjects = await Book.findOne({
          where: { id: book.id },
          include: ["subjects"],
        });

        if (bookWithSubjects) {
          expectedValue.forEach((subjectName) => {
            expect(bookWithSubjects.subjects.map((subject) => subject.name)).toContain(subjectName);
          });
        } 
      }));
    }
  );
});


describe("BookData field associations - Publisher", () => {
  const minimalBookData: BookAPIData = { title: "Test Book" };

  const cases: [Partial<BookAPIData>, keyof Book, any, string][] = [
    [{ publisher: "Publisher 1", isbn: "0000000062" }, "publisher", "Publisher 1", "should correctly associate a publisher"],
    [{ publisher: "Publisher 2", isbn: "0000000063" }, "publisher", "Publisher 2", "should correctly associate a different publisher"],
  ];

  test.each(cases)(
    "%s",
    async (fieldData, fieldToCheck, expectedValue, description) => {
      const validDataArray: BookAPIData[] = [{ ...minimalBookData, ...fieldData }];

      const result = await addBooks(validDataArray);
      expect(result).toBeDefined();
      expect(result.length).toBe(validDataArray.length);

      await Promise.all(result.map(async (book) => {
        expect(book.id).toBeDefined();
        expect(book.createdAt).toBeDefined();

        const bookWithPublisher = await Book.findOne({
          where: { id: book.id },
          include: ["publisher"],
        });

        if (bookWithPublisher) {
          expect(bookWithPublisher.publisher.name).toBe(expectedValue);
        } 
      }));
    }
  );
});

describe("BookData field associations - Publisher (Negative Tests)", () => {
  const minimalBookData: BookAPIData = { title: "Test Book" };

  const cases: [Partial<BookAPIData>, string, string][] = [
    [
      { publisher: "A".repeat(256), isbn: "0000000110" },
      "should reject publisher names longer than 255 characters",
      "Validation error: Validation len on name failed",
    ],
    [
      { publisher: "1", isbn: "0000000112" },
      "should reject numeric publisher names",
      "Validation error: Name cannot consist of numbers only.",
    ],
    [
      { publisher: "-1", isbn: "0000000113" },
      "should reject negative numeric publisher names",
      "Validation error: Name must only contain alphanumeric characters and spaces.",
    ],
    [
      { publisher: "2147483647", isbn: "0000000114" },
      "should reject excessively large numeric strings as publisher names",
      "Validation error: Name cannot consist of numbers only.",
    ],
    [
      { publisher: "-2147483648", isbn: "0000000115" },
      "should reject excessively negative numeric strings as publisher names",
      "Validation error: Name must only contain alphanumeric characters and spaces.",
    ],
  ];

  test.each(cases)(
    "%s",
    async (fieldData, description, expectedError) => {
      const invalidDataArray: BookAPIData[] = [{ ...minimalBookData, ...fieldData }];

      await expect(addBooks(invalidDataArray)).rejects.toThrow(expectedError);
    }
  );
});

describe("getBooksByTitle Positive Tests", () => {
  const positiveTestCases = [
    ["Scrooge", "Scrooge"],
    [
      "The Sentinel: A Jack Reacher Novel",
      "The Sentinel: A Jack Reacher Novel",
    ],
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

});

describe("getBooksByTitle Negative Tests", () => {
  const negativeTestCases: [string | null | undefined, string][] = [
    ["", "Invalid title. Title must be a non-empty string."],
    [null, "Invalid title. Title must be a non-empty string."],
    [undefined, "Invalid title. Title must be a non-empty string."],
  ];

  test.each(negativeTestCases)(
    "should throw an error for invalid title '%s'",
    async (invalidTitle, expectedErrorMessage) => {
      await expect(getBooksByTitle(invalidTitle as any)).rejects.toThrow(
        expectedErrorMessage
      );
    }
  );
});
