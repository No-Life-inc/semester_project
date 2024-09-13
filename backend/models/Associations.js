import User from './User.js';
import BookCollection from './BookCollection.js';
import Book from './Book.js';
import Author from './Author.js';
import Publisher from './Publisher.js';
import BookHasBookCollection from './BookHasBookCollection.js';
import BooksHasAuthors from "./BooksHasAuthors.js";

BookCollection.hasMany(User, { foreignKey: 'book_collection_id' });
User.belongsTo(BookCollection, { foreignKey: 'book_collection_id' });

Publisher.hasMany(Book, { foreignKey: 'publisher_id' });
Book.belongsTo(Publisher, { foreignKey: 'publisher_id' });

Book.belongsToMany(Author, { through: BooksHasAuthors, foreignKey: 'book_id' });
Author.belongsToMany(Book, { through: BooksHasAuthors, foreignKey: 'author_id' });

Book.belongsToMany(BookCollection, { through: BookHasBookCollection, foreignKey: 'books_id' });
BookCollection.belongsToMany(Book, { through: BookHasBookCollection, foreignKey: 'book_collections_id' });