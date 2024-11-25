import '../styles/Books.css';
import { Book } from '../types/type';

interface DisplayBooksProps {
  books: Book[];
  lastBookRef?: (node: HTMLDivElement | null) => void; // Add ref for infinite scroll
}

const truncateTitle = (title: string, maxLength: number = 30) => {
  return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
};

const DisplayBooks: React.FC<DisplayBooksProps> = ({ books, lastBookRef }) => {
  return (
    <div className="book-list">
      {books.map((book, index) => (
        <div
          key={book.id}
          className="card"
          ref={index === books.length - 1 ? lastBookRef : null} // Attach ref to the last book
        >
          <div className="card-image-container">
            {book.image && <img src={book.image} alt={`${book.title} cover`} className="card-image" />}
          </div>
          <div className="card-title" title={book.title}>
            {truncateTitle(book.title)}
          </div>
          <div className="card-content">
            {book.authors && <p>By: {book.authors.map(author => author.name).join(", ")}</p>}
            {book.edition && <p>Edition: {book.edition}</p>}
            {book.isbn && <p>ISBN: {book.isbn}</p>}
            {book.language && <p>Language: {book.language}</p>}
            {book.publicationDate && (
              <p>Publication Date: {new Date(book.publicationDate).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DisplayBooks;
