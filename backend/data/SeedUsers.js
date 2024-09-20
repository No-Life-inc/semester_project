import User from "../models/User.ts";

const seedUsers = async () => {
    try {
        const usersCount = await User.count();

        if (usersCount === 0) {
            await User.bulkCreate([
                { book_collection_id: 1, email: "user1@example.com", name: "User One" },
                { book_collection_id: 2, email: "user2@example.com", name: "User Two" },
                { book_collection_id: 3, email: "user3@example.com", name: "User Three" },
            ]);

            console.log("Dummy user data inserted successfully.");
        } else {
            console.log("Data already exists, skipping dummy user data insertion.");
        }
    } catch (error) {
        console.error("Error inserting dummy user data:", error);
    }
};

export default seedUsers;