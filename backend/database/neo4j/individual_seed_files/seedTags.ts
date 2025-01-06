import connectToNeo4j from "../../../dbconnections/Neo4jConnection";
import { v4 as uuidv4 } from "uuid";

// Neo4j connection details

async function seedTags() {
  const driver = await connectToNeo4j();
  const session = driver.session();

  try {
    // Clear existing data (optional for testing)
    await session.run(`MATCH (t:Tag) DETACH DELETE t`);
    console.log("Tags cleared.");

    // Seed tags
    const tags = [
      "Favourites",
      "Moms smut",
      "Classic",
      "Need to read",
      "Must read",
      "Later",
      "Science Fiction",
      "Fantasy",
      "Non-fiction",
      "Biography",
      "Historical",
      "Romance",
      "Thriller",
      "Mystery",
      "Horror",
      "Young Adult",
      "Children's",
      "Adventure",
      "Humor",
      "Self-help",
      "Health & Wellness",
      "Cookbooks",
      "Poetry",
      "Drama",
      "Short Stories",
      "Classics",
      "Philosophy",
      "Politics",
      "Economics",
      "Spirituality",
      "Religion",
      "Travel",
      "Memoir",
      "Autobiography",
      "Art",
      "Photography",
      "Music",
      "Sports",
      "Nature",
      "Science",
      "Technology",
      "Programming",
      "Business",
      "Marketing",
      "Entrepreneurship",
      "Psychology",
      "Education",
      "Parenting",
      "Animals",
      "Home & Garden",
      "DIY",
      "Crafts",
      "Comics",
      "Graphic Novels",
      "Manga",
      "Anime",
      "War",
      "Military",
      "Western",
    ];

    for (const tag of tags) {
      await session.run(`CREATE (t:Tag {name: $name, guid: $guid})`, {
        name: tag,
        guid: uuidv4(),
      });
    }
    console.log("Tags seeded.");
  } catch (error) {
    console.error("Error seeding Neo4j:", error);
  } finally {
    await session.close();
    await driver.close();
  }
}

export default seedTags;
