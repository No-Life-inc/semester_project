interface BookData {
    title: string;
    image?: string;
    title_long?: string;
    date_published?: string;
    publisher?: string;
    synopsis?: string;
    subjects?: string[];
    authors?: string[];
    isbn13?: string;
    msrp?: number;
    edition?: string;
    binding?: string;
    isbn?: string;
    isbn10?: string;
    language?: string;
    dimensions?: string;
    dimensions_structured?: {
        length?: { value: number; unit: string };
        width?: { value: number; unit: string };
        height?: { value: number; unit: string };
        weight?: { value: number; unit: string };
    };
    pages?: number;
    publisher_id?: number;
}

export default BookData;