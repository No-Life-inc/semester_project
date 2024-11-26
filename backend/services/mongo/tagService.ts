import { User } from '../../models/mongoose/UserModel';

export const getTagsService = async (userId: string, bookId: string) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const book = user.books.find(b => b.book_id.equals(bookId));
    if (!book) throw new Error('Book not found in user library');

    return book.tags;
}

export const addTagService = async (userId: string, bookId: string, tag: string) =>  {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const book = user.books.find(b => b.book_id.equals(bookId));
    if (!book) throw new Error('Book not found in user library');

    if (!book.tags.includes(tag)) {
        book.tags.push(tag);
        await user.save();
    }
    return book.tags;
}

export const removeTagService = async (userId: string, bookId: string, tag: string) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const book = user.books.find(b => b.book_id.equals(bookId));
    if (!book) throw new Error('Book not found in user library');

    book.tags = book.tags.filter(existingTag => existingTag !== tag);
    await user.save();
    return book.tags;
}



