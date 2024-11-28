import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const connectToNeo4j = async () => {
    try {
        const uri = process.env.NEO4J_URI || 'blah';
        const user = process.env.NEO4J_USERNAME || 'blah';
        const password = process.env.DB_PASSWORD || 'blah';
        const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
        console.log('Neo4j connected');
        return driver;
    } catch (error) {
        console.error('Neo4j connection error:', error);
        process.exit(1);
    }
}

export default connectToNeo4j;