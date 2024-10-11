import User from "../models/User.ts";

const seedUsers = async () => {
    try {
        const usersCount = await User.count();

        if (usersCount === 0) {
            await User.bulkCreate([
                { email: "user1@example.com", name: "User One" },
                { email: "user2@example.com", name: "User Two" },
                { email: "user3@example.com", name: "User Three" },
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
