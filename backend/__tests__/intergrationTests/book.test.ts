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
import knex from "knex";
import knexConfig from "../../knexfile";
import {
  getBooks,
  getBookById,
  addBooks,
  getBooksByTitle,
} from "../../services/bookService";
import Publisher from "../../models/sequelize/Publisher";
import Subject from "../../models/sequelize/Subject";
import BookAPIData from "../../types/bookAPIData";
import Book from "../../models/sequelize/Book";

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
    [
      -1,
      10,
      "Invalid page number. Page must be a number greater than or equal to 1.",
    ],
    [
      NaN,
      10,
      "Invalid page number. Page must be a number greater than or equal to 1.",
    ],
    [
      1,
      -10,
      "Invalid limit. Limit must be a number greater than or equal to 1.",
    ],
    [
      1,
      NaN,
      "Invalid limit. Limit must be a number greater than or equal to 1.",
    ],
    [
      1,
      101,
      "Invalid limit. Limit must be a number less than or equal to 100.",
    ],
  ];

  test.each(negativeTestCases)(
    "should throw an error (page: %i, limit: %i, errorMessage: %s)",
    async (page, limit, errorMessage) => {
      await expect(getBooks(Number(page), Number(limit))).rejects.toThrow(
        errorMessage
      );
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
  const negativeTestCases: [number, string][] = [
    [
      -1,
      "Invalid book id. Book id must be a number greater than or equal to 1.",
    ],
    [
      NaN,
      "Invalid book id. Book id must be a number greater than or equal to 1.",
    ],
    [5000, "Book not found"],
    [
      0,
      "Invalid book id. Book id must be a number greater than or equal to 1.",
    ],
    [
      "1" as any,
      "Invalid book id. Book id must be a number greater than or equal to 1.",
    ],
  ];

  test.each(negativeTestCases)(
    "should throw an error (bookId: %i, errorMessage: %s)",
    async (bookId: any, errorMessage: string) => {
      await expect(getBookById(bookId)).rejects.toThrow(errorMessage);
    }
  );
});


describe("BookData field boundary positive tests", () => {
  const maxText =
    "Maximal is a long text of 255 characters, and this text will be 255 characters long. Max es un texto largo de 255 caracteres, y este texto tendrá 255 caracteres. Maksimal er en tekst på 255 tegn, og denne tekst vil være på 255 tegn. Her er fyld til sidst.";
  const maxTextMinusOne =
    "Maximal is a long text of 255 characters, and this text will be 255 characters long. Max es un texto largo de 255 caracteres, y este texto tendrá 255 caracteres. Maksimal er en tekst på 255 tegn, og denne tekst vil være på 255 tegn. Her er fyld til sidst";
  
  const maxInt = 2147483647;
  const maxMSRP = 99999999.98;

  const minimalBookData: BookAPIData = { title: " " };

  const cases: [Partial<BookAPIData>, keyof Book, any, string][] = [
    [{ isbn: "1234567889" }, "title", " ", "should accept minimal valid title"],
    [{ title: "A", isbn: "1234567890" }, "title", "A", "should accept minimal valid title"],
    [{ title: "Default Title", isbn: "1234567888" }, "title", "Default Title", "should accept a middle valid title"],
    [{ title: maxText, isbn: "1234567891" }, "title", maxText, "should accept maximal title (255 chars)"],
    [{ title: maxTextMinusOne, isbn: "1234567892" }, "title", maxTextMinusOne, "should accept title one character below limit"],

    // Image field tests
    [{ image: "", isbn: "1234567893" }, "image", "", "should accept minimal image URL"],
    [{ image: "a", isbn: "1234567894" }, "image", "a", "should accept close to minimal image URL"],
    [{ image: "http://".padEnd(140, "a"), isbn: "1234567895" }, "image", "http://".padEnd(140, "a"), "should accept a middle image URL"],
    [{ image: "http://".padEnd(255, "a"), isbn: "0000000006" }, "image", "http://".padEnd(255, "a"), "should accept maximal image URL (255 chars)"],
    [{ image: "http://".padEnd(254, "a"), isbn: "1234567896" }, "image", "http://".padEnd(254, "a"), "should accept close to maximal image URL (254 chars)"],

    // Title_long field tests
    [{ title_long: "", isbn: "0000000001" }, "titleLong", "", "should accept minimal title_long"],
    [{ title_long: "a", isbn: "0000000002" }, "titleLong", "a", "should accept close to minimal title_long"],
    [{ title_long: "Default Title", isbn: "0000000005" }, "titleLong", "Default Title", "should accept a middle title_long"],
    [{ title_long: maxText, isbn: "0000000003" }, "titleLong", maxText, "should accept maximal title_long (255 chars)"],
    [{ title_long: maxTextMinusOne, isbn: "0000000004" }, "titleLong", maxTextMinusOne, "should accept maximal title_long (255 chars)"],

    // Date_published field tests
    [{ date_published: '0001-01-01', isbn: "0000000007" }, "publicationDate", '0001-01-01', "should accept minimal date_published"],
    [{ date_published: '0001-01-02', isbn: "0000000010" }, "publicationDate", '0001-01-02', "should accept close to minimal date_published"],
    [{ date_published: "9999-12-29", isbn: "0000000011" }, "publicationDate", "9999-12-29", "should accept close to max date format for date_published"],
    [{ date_published: "9999-12-30", isbn: "0000000008" }, "publicationDate", "9999-12-30", "should accept max date format for date_published"],
    [{ date_published: "2024-11-15", isbn: "0000000012" }, "publicationDate", "2024-11-15", "should accept typical date format for date_published"],

    //Synopsis field tests
    [{ synopsis: "", isbn: "0000000014" }, "synopsis", "", "should accept minimal synopsis"],
    [{ synopsis: " ", isbn: "0000000015" }, "synopsis", " ", "should accept close to minimal synopsis"],
    [{ synopsis: maxText, isbn: "0000000013" }, "synopsis", maxText, "should accept maximal synopsis (255 chars)"],
    [{ synopsis: maxTextMinusOne, isbn: "0000000016" }, "synopsis", maxTextMinusOne, "should accept maximal synopsis (255 chars)"],
    [{ synopsis: "Test synopsis", isbn: "0000000017" }, "synopsis", "Test synopsis", "should accept a middle synopsis"],

    //isbn13 field tests
    [{ isbn13: "", isbn: "0000000018" }, "isbn13", "", "should accept minimal isbn13"],
    [{ isbn13: " ", isbn: "0000000020" }, "isbn13", " ", "should accept close to minimum ISBN-13 (13 chars)"],
    [{ isbn13: "9999999999999", isbn: "0000000019" }, "isbn13", "9999999999999", "should accept max ISBN-13 (13 chars)"],
    [{ isbn13: "999999999999", isbn: "0000000022" }, "isbn13", "999999999999", "should accept close to max ISBN-13 (13 chars)"],
    [{ isbn13: "1234567890123", isbn: "0000000021" }, "isbn13", "1234567890123", "should accept a middle ISBN-13 (13 chars)"],

    //edition field tests
    [{ edition: "", isbn: "0000000023" }, "edition", "", "should accept minimal edition"],
    [{ edition: "a", isbn: "0000000024" }, "edition", "a", "should accept close to minimal edition"],
    [{ edition: maxText, isbn: "0000000025" }, "edition", maxText, "should accept maximal edition (255 chars)"],
    [{ edition: maxTextMinusOne, isbn: "0000000026" }, "edition", maxTextMinusOne, "should accept maximal edition (255 chars)"],
    [{ edition: "Default Edition", isbn: "0000000027" }, "edition", "Default Edition", "should accept a middle edition"],

    //binding field tests
    [{ binding: "", isbn: "0000000028" }, "binding", "", "should accept minimal binding"],
    [{ binding: "a", isbn: "0000000029" }, "binding", "a", "should accept close to minimal binding"],
    [{ binding: maxText, isbn: "0000000030" }, "binding", maxText, "should accept maximal binding (255 chars)"],
    [{ binding: maxTextMinusOne, isbn: "0000000031" }, "binding", maxTextMinusOne, "should accept maximal binding (255 chars)"],
    [{ binding: "Default Binding", isbn: "0000000032" }, "binding", "Default Binding", "should accept a middle binding"],

    //language field tests
    [{ language: "", isbn: "0000000033" }, "language", "", "should accept minimal language"],
    [{ language: "a", isbn: "0000000034" }, "language", "a", "should accept close to minimal language"],
    [{ language: maxText, isbn: "0000000035" }, "language", maxText, "should accept maximal language (255 chars)"],
    [{ language: maxTextMinusOne, isbn: "0000000036" }, "language", maxTextMinusOne, "should accept language binding (255 chars)"],
    [{ language: "Default language", isbn: "0000000037" }, "language", "Default language", "should accept a middle language"],

    //dimensions field tests
    [{ dimensions: "", isbn: "0000000038" }, "dimensions", "", "should accept minimal dimensions"],
    [{ dimensions: "a", isbn: "0000000039" }, "dimensions", "a", "should accept close to minimal dimensions"],
    [{ dimensions: maxText, isbn: "0000000040" }, "dimensions", maxText, "should accept maximal dimensions (255 chars)"],
    [{ dimensions: maxTextMinusOne, isbn: "0000000041" }, "dimensions", maxTextMinusOne, "should accept maximal dimensions (255 chars)"],
    [{ dimensions: "Default dimensions", isbn: "0000000042" }, "dimensions", "Default dimensions", "should accept a middle dimensions"],

    //isbn10 field tests
    [{ isbn10: "", isbn: "0000000043" }, "isbn10", "", "should accept minimal isbn10"],
    [{ isbn10: " ", isbn: "0000000044" }, "isbn10", " ", "should accept close to minimal isbn10"],
    [{ isbn10: "1234567890", isbn: "0000000045" }, "isbn10", "1234567890", "should accept middle isbn10 (10 chars)"],
    [{ isbn10: "123456789", isbn: "0000000046" }, "isbn10", "123456789", "should accept close to max isbn10 (10 chars)"],
    [{ isbn10: "9999999999", isbn: "0000000047" }, "isbn10", "9999999999", "should accept maximal isbn10 (10 chars)"],

    //pages field tests
    [{ pages: 0, isbn: "0000000048" }, "pages", 0, "should accept minimal pages"],
    [{ pages: 1, isbn: "0000000049" }, "pages", 1, "should accept close to minimal pages"],
    [{ pages: 100, isbn: "0000000050" }, "pages", 100, "should accept middle pages"],
    [{ pages: 9999, isbn: "0000000051" }, "pages", 9999, "should accept some large page number"],
    [{ pages: maxInt, isbn: "0000000052" }, "pages", maxInt, "should accept maximal pages (INT_MAX)"],

    [{ msrp: 0, isbn: "0000000053" }, "msrp", 0, "should accept minimal msrp"],
    [{ msrp: 1, isbn: "0000000054" }, "msrp", 1, "should accept close to minimal msrp"],
    [{ msrp: 100, isbn: "0000000055" }, "msrp", 100, "should accept middle msrp value"],
    [{ msrp: 9999, isbn: "0000000056" }, "msrp", 9999, "should accept a large msrp value"],
    [{ msrp: maxMSRP, isbn: "0000000057" }, "msrp", maxMSRP, "should accept maximal msrp (INT_MAX)"],
  

  ];

  test.each(cases)(
    "%s",
    async (fieldData, fieldToCheck, expectedValue, description) => {
      // Prepare the data array
      const validDataArray: BookAPIData[] = [{...minimalBookData, ...fieldData }];
    ;

      // Perform the test
      const result = await addBooks(validDataArray);

      // Validate results
      expect(result).toBeDefined();
      expect(result.length).toBe(validDataArray.length);

      // Check the specific field
      result.forEach((book) => {
        expect(book[fieldToCheck]).toEqual(expectedValue);
        expect(book.id).toBeDefined();
        expect(book.createdAt).toBeDefined();
      });
    }
  );
});

describe("BookData field boundary negative tests", () => {
  const overMaxText = "A".repeat(256); // 256 characters
  const invalidDate = "10000-01-01"; // Beyond valid date range
  const invalidISBN10 = "12345678901"; // 11 characters for a 10-character field
  const invalidISBN13 = "12345678901234"; // 14 characters for a 13-character field
  const overMaxMSRP = 100000000.0; // Exceeds valid max value
  const underMaxMSRP = -100000000.0;
  const maxInt = 2147483647;
  const negativeMaxInt = -2147483648;

  const minimalBookData: BookAPIData = { title: " " };

  const cases: [Partial<BookAPIData>, string][] = [
    // Title field tests
    [{ title: overMaxText }, "should reject title exceeding 255 characters"],
    [{ title: undefined }, "should reject undefined title"],
    [{ title: "" }, "should reject empty title"],
    [{ title: null }, "should reject null title"],

    // Image field tests
    [{ image: overMaxText }, "should reject image URL exceeding 255 characters"],

    // Title_long field tests
    [{ title_long: overMaxText }, "should reject title_long exceeding 255 characters"],

    // Date_published field tests
    [{ date_published: invalidDate }, "should reject invalid date_published beyond 9999-12-31"],
    [{ date_published: "0000-00-00" }, "should reject invalid date_published of 0001-01-00"],
    [{ date_published: "9999-12-31" }, "should reject invalid date_published of 9999-12-31"],
    [{ date_published: "9999-12-32" }, "should reject invalid date_published of 9999-12-32"],

    // ISBN fields
    [{ isbn10: invalidISBN10 }, "should reject isbn10 exceeding 10 characters"],
    [{ isbn13: invalidISBN13 }, "should reject isbn13 exceeding 13 characters"],
    [{ isbn: invalidISBN13 }, "should reject isbn exceeding 10 characters"],
    [{ isbn: undefined}, "should reject undefined isbn"],
    [{ isbn: "" }, "should reject empty isbn"],
    [{ isbn: null}, "should reject null isbn"],

    // Pages field tests
    [{ pages: -1 }, "should reject negative pages value"],
    [{ pages: maxInt + 1 }, "should reject pages exceeding INT_MAX"],
    [{ pages: negativeMaxInt }, "should reject pages below INT_MIN"],
    [{ pages: -10000 }, "should reject pages exceeding valid min value"],
    [{ pages: NaN }, "should reject Nan pages value"],

    // MSRP field tests
    [{ msrp: overMaxMSRP }, "should reject msrp exceeding valid max value"],
    [{ msrp: -1 }, "should reject negative msrp value"],
    [{ msrp: underMaxMSRP }, "should reject msrp below valid min value"],
    [{ msrp: -10000 }, "should reject msrp below valid min value"],
    [{ msrp: NaN }, "should reject Nan msrp"],

    // Other field tests
    [{ binding: overMaxText }, "should reject binding exceeding 255 characters"],
    [{ dimensions: overMaxText }, "should reject dimensions exceeding 255 characters"],
    [{ synopsis: overMaxText }, "should reject synopsis exceeding 255 characters"],
    [{ language: overMaxText }, "should reject language exceeding 255 characters"],
  ];

  test.each(cases)("%s", async (fieldData, description) => {
    // Prepare the data array
    const invalidDataArray: BookAPIData[] = [{...minimalBookData, ...fieldData }];

    // Perform the test
    await expect(addBooks(invalidDataArray)).rejects.toThrow(
      /validation error|invalid/i // Customize the error message expected
    );
  });
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
        } else {
          throw new Error(`Book with ID ${book.id} not found`);
        }
      }));
    }
  );
});

describe("BookData field associations - Authors (Negative Tests)", () => {
  const maxTextPlusOne = "Maximal is a long text of 255 characters, and this text will be 255 characters long. Max es un texto largo de 255 caracteres, y este texto tendrá 255 caracteres. Maksimal er en tekst på 255 tegn, og denne tekst vil være på 255 tegn. Her er fyld til sidst.-";
  const maxInt = 2147483647;
  const negativeMaxInt = -2147483648;

  const minimalBookData: BookAPIData = { title: "Test Book" };

  const cases: [Partial<BookAPIData>, string][] = [
    [{ authors: [maxTextPlusOne], isbn: "0000000101"}, "should ignore empty or invalid author names"],
    [{ authors: ["1"], isbn: "0000000102"}, "should ignore empty or invalid author names"],
    [{ authors: ["-1"], isbn: "0000000103"}, "should ignore empty or invalid author names"],
    [{ authors: [undefined as any], isbn: "0000000107"}, "should ignore empty or invalid author names"],
    [{ authors: [maxInt.toString()], isbn: "0000000108"}, "should ignore empty or invalid author names"],
    [{ authors: [negativeMaxInt.toString()], isbn: "0000000109"}, "should ignore empty or invalid author names"],
    // [{ authors: [1], isbn: "0000000112"}, "should ignore empty or invalid author names"],
    // [{ authors: [-1], isbn: "0000000113"}, "should ignore empty or invalid author names"],
  ];

  test.each(cases)(
    "%s",
    async (fieldData, description) => {
      const invalidDataArray: BookAPIData[] = [{ ...minimalBookData, ...fieldData }];

      // Perform the test
    await expect(addBooks(invalidDataArray)).rejects.toThrow(
      /validation error|invalid/i // Customize the error message expected
    );
  });
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
        } else {
          throw new Error(`Book with ID ${book.id} not found`);
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
        } else {
          throw new Error(`Book with ID ${book.id} not found`);
        }
      }));
    }
  );
});


describe("getBooksByTitle function", () => {
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

  const negativeTestCases: [string | null, string][] = [
    ["", "Invalid title. Title must be a non-empty string."],
    [null, "Invalid title. Title must be a non-empty string."],
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
