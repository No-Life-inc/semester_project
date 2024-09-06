# REPO TEMPLATE

## Contributors

- Morten Bendeke
- Betül Iskender
- Yelong Hartl-He
- Zack Ottesen

## General Use

To create multiple databases that contains the same data. <br>
The repository includes 3 main directories. The backend is created with Node.js, the frontend is created with React TS and the Database includes 3 different which are MSSQL, MongoDB and Neo4j. <br>
- backend
- database <br>
      -sql<br>
      -mongo<br>
      -neo4j
- frontend

## Environment Variables

Create a .env in the root folder.

#FRONTEND
FRONTEND_PORT=3000

#BACKEND
BACKEND_PORT=5000

#DATABASE
DB_PASSWORD=YourStrongPassword123

## How To Run


Make sure the environment variables are set.<br>
Setup all the Repositories for this project and update them to the the development branch.<br>
Be in the root of the project with your terminal
Lastly, use the following command:

```bash
docker-compose up --build
```