import connectToNeo4j from "../../dbconnections/Neo4jConnection";
import Subject from "../../models/neo4j/Subject";
import neo4j from "neo4j-driver";

/**
 * Fetches subjects from the Neo4j database with optional pagination.
 * Returns them as an array of Tag instances.
 *
 * @param {number} skip - The number of records to skip (default is 0).
 * @param {number} limit - The maximum number of records to return (default is 10).
 * @returns {Promise<Subject[]>} - A promise that resolves to an array of Tag instances.
 */
export const getSubjects = async (
  skip: number = 0,
  limit: number = 10
): Promise<Subject[]> => {
  const driver = await connectToNeo4j();
  const session = driver.session();

  try {
    const result = await session.run(
      `
            MATCH (s:Subject)
            RETURN s
            SKIP $skip
            LIMIT $limit
            `,
      { skip: neo4j.int(skip), limit: neo4j.int(limit) }
    );

    const subjects: Subject[] = result.records.map((record) => {
      const subjectNode = record.get("s");
      return subjectNode.properties as Subject;
    });

    return subjects;
  } catch (error) {
    throw error;
  } finally {
    await session.close();
    await driver.close();
  }
};

/**
 * Fetches a subject from the Neo4j database by its ID.
 *
 * @param {string} guid - The GUID of the subject to fetch.
 * @returns {Promise<Subject>} - A promise that resolves to a Subject instance.
 */
export const getSubjectByGuid = async (guid: string): Promise<Subject> => {
  const driver = await connectToNeo4j();
  const session = driver.session();

  guid = guid.trim();

  try {
    const result = await session.run(
      `
            MATCH (s:Subject {guid: $guid})
            LIMIT 1
            RETURN s
            `,
      { guid }
    );

    if (result.records.length === 0) {
      return null;
    }

    const subjectNode = result.records[0].get("s");
    const subject = subjectNode.properties as Subject;

    return subject;
  } catch (error) {
    throw error;
  } finally {
    await session.close();
    await driver.close();
  }
};

/**
 * Fetches a list of subjects from the Neo4j database that have a name containing the specified partial name.
 * The search is case-insensitive and will return all subjects where the name includes the provided string.
 * 
 * @param {string} partialName - The partial string to search for within the subject names. Leading and trailing spaces are trimmed.
 * @returns {Promise<Subject[]>} - A promise that resolves to an array of `Subject` instances that match the partial name.
 * If no subjects are found, an empty array is returned.
 * 
 * @throws {Error} - Throws an error if there is an issue querying the Neo4j database.
 * 
 * @example
 * const subjects = await getSubjectsByPartialName('Math');
 */
export const getSubjectsByPartialName = async (partialName: string): Promise<Subject[]> => {
    const driver = await connectToNeo4j();
    const session = driver.session();
  
    try {
      const result = await session.run(
        `
        MATCH (s:Subject) 
        WHERE toLower(s.name) CONTAINS toLower($partialName) 
        RETURN s
        `,
        { partialName }
      );

      if (result.records.length === 0) {
        return []; // Return an empty array if no subjects are found
      }
  
      // Map over the result to extract the properties of each subject node
      const subjects: Subject[] = result.records.map(record => {
        const subjectNode = record.get('s');
        return subjectNode.properties as Subject;
      });
  
      return subjects;
    } catch (error) {
      console.error('Error fetching subjects:', error);
      throw error;
    } finally {
      await session.close();
      await driver.close();
    }
  }
  