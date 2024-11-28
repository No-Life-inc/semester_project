import {IUser, User} from '../../models/mongoose/UserModel';

export const getTagsService = async (email: string, bookId: string) => {
    const user = await User.findOne({email}) as IUser;
    if (!user) throw new Error('User not found');

    //Find tags for the book
    const book = user.books.find(b => b.book_id.equals(bookId));
    if (!book) throw new Error('Book not found in user library');
    return book.tags;

}

export const addTagService = async (email: string, bookId: string, tag: string) =>  {
    const user = await User.findOne({email}) as IUser;
    if (!user) throw new Error('User not found');

    const book = user.books.find(b => b.book_id.equals(bookId));
    if (!book) throw new Error('Book not found in user library');

    if (!book.tags.includes(tag)) {
        book.tags.push(tag);
        await user.save();
    }
    return book.tags;
}

export const removeTagService = async (email: string, bookId: string, tag: string) => {
    const user = await User.findOne({email}) as IUser;
    if (!user) throw new Error('User not found');

    const book = user.books.find(b => b.book_id.equals(bookId));
    if (!book) throw new Error('Book not found in user library');

    book.tags = book.tags.filter(existingTag => existingTag !== tag);
    await user.save();
    return book.tags;
}



