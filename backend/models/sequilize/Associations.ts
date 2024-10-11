import User from "./User";
import Book from "./Book";
import Author from "./Author";
import Publisher from "./Publisher";
import Tag from "./Tag";
import UserBook from "./UserBook";
import UserBookTag from "./UserBookTag";
import Collection from "./Collection";
import UserCollection from "./UserCollection";
import UserBookCollection from "./UserBookCollection";

// Many-to-Many relationship between User and BookModel.ts through UserBook
User.belongsToMany(Book, { through: UserBook, foreignKey: "user_id", as: "books" });
Book.belongsToMany(User, { through: UserBook, foreignKey: "book_id", as: "users" });

// One-to-Many relationship between Publisher and BookModel.ts
Publisher.hasMany(Book, { foreignKey: "publisher_id", as: "books" });
Book.belongsTo(Publisher, { foreignKey: "publisher_id", as: "publisher" });

// Many-to-Many relationship between BookModel.ts and Author
Book.belongsToMany(Author, { through: "books_authors", foreignKey: "book_id", as: "authors" });
Author.belongsToMany(Book, { through: "books_authors", foreignKey: "author_id", as: "books" });

// One-to-Many relationship between UserBook and UserBookTag
UserBook.hasMany(UserBookTag, { foreignKey: "user_book_id", as: "tags" });
UserBookTag.belongsTo(UserBook, { foreignKey: "user_book_id", as: "user_book" });

// One-to-Many relationship between Tag and UserBookTag
Tag.hasMany(UserBookTag, { foreignKey: "tag_id", as: "user_book_tags" });
UserBookTag.belongsTo(Tag, { foreignKey: "tag_id", as: "tag" });

// Many-to-Many relationship between User and Collection through UserCollection
User.belongsToMany(Collection, { through: UserCollection, foreignKey: "user_id", as: "collections" });
Collection.belongsToMany(User, { through: UserCollection, foreignKey: "collection_id", as: "users" });

// Many-to-Many relationship between Collection and UserBook through UserBookCollection
Collection.belongsToMany(UserBook, { through: UserBookCollection, foreignKey: "collection_id", as: "user_books" });
UserBook.belongsToMany(Collection, { through: UserBookCollection, foreignKey: "user_book_id", as: "collections" });
