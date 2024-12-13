import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const seedDatabaseUser = async () => {
    const uri = process.env.MONGO_URI; // Replace with your MongoDB connection string
    const client = new MongoClient(uri);
    
    try {
        // Connect to the MongoDB instance
        await client.connect();
        
        const adminDb = client.db("admin");
        // Access the target database where the role will be created

        //delete user if exists
    
        // Check if the role already exists
        const existingRoles = await adminDb.command({ rolesInfo: { role: "granular_role", db: "test" } });

        if (!existingRoles.roles || existingRoles.roles.length === 0) {
            console.log('Role "granular_role" does not exist. Creating role...');
            // Create the custom role in the "test" database
            await adminDb.command({
                createRole: "granular_role",
                privileges: [
                    {
                        resource: { db: "test", collection: "books" },
                        actions: ["find", "insert", "update"],
                    },
                ],
                roles: [],
            });
            console.log('Role "granular_role" created successfully.');
        } else {
            console.log('Role "granular_role" already exists.');
        }

        // Access the admin database to handle the user

        // Check if the user already exists
        const existingUsers = await adminDb.command({ usersInfo: "granular_user" });

        if (existingUsers.users && existingUsers.users.length > 0) {
            console.log('User "granular_user" already exists. Skipping user creation.');
            return;
        }

        console.log('Creating user "granular_user"...');

        // Create the user and assign the custom role
        await adminDb.command({
            createUser: "granular_user",
            pwd: "secure_password", // Replace with a secure password
            roles: [
                {
                    role: "granular_role", // Assign the custom role
                    db: "test",
                },
            ], 
        });

        console.log('Database user "granular_user" created and assigned role "granular_role" successfully!');
    } catch (error) {
        console.error("Error seeding database user:", error);
    } finally {
        // Close the client
        await client.close();
    }
};

export default seedDatabaseUser;
