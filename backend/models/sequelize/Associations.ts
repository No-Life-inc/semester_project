import User from "./User";
import Book from "./Book";
import Author from "./Author";
import Publisher from "./Publisher";
import Tag from "./Tag";
import UserBook from "./UserBook";
import UserBookTag from "./UserBookTag";
import Collection from "./Collection";
import UserBookCollection from "./UserBookCollection";
import Subject from "./Subject";

// Many-to-Many relationship between User and BookModel.ts through UserBook
User.belongsToMany(Book, { through: UserBook, foreignKey: "user_id", as: "books" });
Book.belongsToMany(User, { through: UserBook, foreignKey: "book_id", as: "users" });

// One-to-Many relationship between Publisher and BookModel.ts
Publisher.hasMany(Book, { foreignKey: "publisher_id", as: "books" });
Book.belongsTo(Publisher, { foreignKey: "publisher_id", as: "publisher" });

// Many-to-Many relationship between BookModel and Author
Book.belongsToMany(Author, { through: "book_authors", foreignKey: "book_id", as: "authors" });
Author.belongsToMany(Book, { through: "book_authors", foreignKey: "author_id", as: "books" });

// One-to-Many relationship between UserBook and UserBookTag
UserBook.hasMany(UserBookTag, { foreignKey: "user_book_id", as: "tags" });
UserBookTag.belongsTo(UserBook, { foreignKey: "user_book_id", as: "user_book" });

// One-to-Many relationship between Tag and UserBookTag
Tag.hasMany(UserBookTag, { foreignKey: "tag_id", as: "user_book_tags" });
UserBookTag.belongsTo(Tag, { foreignKey: "tag_id", as: "tag" });

// One-to-Many relationship between User and Collection
User.hasMany(Collection, { foreignKey: "user_id", as: "collections" });
Collection.belongsTo(User, { foreignKey: "collection_id", as: "users" });

// Many-to-Many relationship between Collection and UserBook through UserBookCollection
Collection.belongsToMany(UserBook, { through: UserBookCollection, foreignKey: "collection_id", as: "user_books" });
UserBook.belongsToMany(Collection, { through: UserBookCollection, foreignKey: "user_book_id", as: "collections" });

// Many-to-Many relationship between Book and Subject through book_subjects
Book.belongsToMany(Subject, { through: "book_subjects", foreignKey: "book_id", as: "subjects" });
Subject.belongsToMany(Book, { through: "book_subjects", foreignKey: "subject_id", as: "books" });

UserBook.belongsTo(Book, { foreignKey: "book_id", as: "book" }); // Define alias for accessing Book


