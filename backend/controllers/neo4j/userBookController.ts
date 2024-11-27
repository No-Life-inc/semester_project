import { getUserBooks } from "../../services/neo4j/userBookService";

/**
 * Controller to handle requests for fetching user books.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
const getUserBookController = async (req, res) => {
    const { email } = req.params; // Extract email from route parameter
    const { page, limit } = req.query; // Extract pagination options from query parameters

    try {
        // Validate required parameters
        if (!email) {
            return res.status(400).json({ error: "Email parameter is required." });
        }

        // Parse pagination values or use defaults
        const pageNumber = parseInt(page) || 1; // Default page: 1
        const limitNumber = parseInt(limit) || 50; // Default limit: 50

        // Fetch user books from the service
        const { user, books } = await getUserBooks(email, pageNumber, limitNumber);

        // Respond with the user and their books
        if (books.length === 0) {
            return res.status(404).json({
                message: "No books found for this user.",
                user,
                books: [],
            });
        }

        res.status(200).json({
            user,
            books,
        });
    } catch (error) {
        console.error("Error in getUserBooksController:", error);
        res.status(500).json({ error: "Failed to fetch user books." });
    }
};

export default getUserBookController;