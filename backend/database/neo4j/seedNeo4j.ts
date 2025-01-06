import seedConstraints from './individual_seed_files/seedConstraints';
import seedBooks from './individual_seed_files/seedBooks';
import seedTags from './individual_seed_files/seedTags';
import seedUsers from './individual_seed_files/seedUsers';
import connectToNeo4j from '../../dbconnections/Neo4jConnection';
import seedIndexes from './individual_seed_files/seedIndexes';

export default async function seedNeo4j() {
    const driver = await connectToNeo4j();
    const session = driver.session();

    // Clear existing data (optional for testing)
    await session.run(`MATCH (n) DETACH DELETE n`);

    try {
        console.log("Clearing the database...");
        await session.run(`MATCH (n) DETACH DELETE n`);
    
        await seedIndexes();
        await seedConstraints(); 
        await seedBooks();
        await seedTags();
        await seedUsers();  
    
        console.log("Seeding completed successfully.");
      } catch (error) {
        console.error("Error during seeding process:", error);
      }
        finally {
            await session.close();
            await driver.close();
        }
};

// seedNeo4j();