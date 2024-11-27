import book from "./book";

interface Collection {
    id: string;
    name: string;
    description: string;
    books: book[];
}

export default Collection;