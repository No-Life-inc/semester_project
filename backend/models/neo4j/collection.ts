import book from "./book";

interface Collection {
    id: string;
    guid: string;
    name: string;
    description: string;
    books: book[];
}

export default Collection;