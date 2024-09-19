// Import models without .js extension
import User from './User';
import BookCollection from './BookCollection';
import Book from './Book';
import Author from './Author';
import Publisher from './Publisher';
import BookHasBookCollection from './BookHasBookCollection';
import BooksHasAuthors from "./BooksHasAuthors";

// Define model associations with TypeScript

// User - BookCollection relationship
User.hasMany(BookCollection, { foreignKey: 'user_id' });
BookCollection.belongsTo(User, { foreignKey: 'user_id' });

// Publisher - Book relationship
Publisher.hasMany(Book, { foreignKey: 'publisher_id' });
Book.belongsTo(Publisher, { foreignKey: 'publisher_id' });

// Book - Author many-to-many relationship
Book.belongsToMany(Author, { through: BooksHasAuthors, foreignKey: 'book_id' });
Author.belongsToMany(Book, { through: BooksHasAuthors, foreignKey: 'author_id' });

// Book - BookCollection many-to-many relationship
Book.belongsToMany(BookCollection, { through: BookHasBookCollection, foreignKey: 'books_id' });
BookCollection.belongsToMany(Book, { through: BookHasBookCollection, foreignKey: 'book_collections_id' });

// Export models
export { User, BookCollection, Book, Author, Publisher, BookHasBookCollection, BooksHasAuthors };
