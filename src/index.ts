import { ApolloServer } from "@apollo/server"; // Import ApolloServer from @apollo/server
import { expressMiddleware } from "@apollo/server/express4"; // Import expressMiddleware from @apollo/server/express4
import bodyParser from "body-parser";
import express from "express"; // Import express from express

async function init() {
	const app = express(); // Create an instance of express
	const PORT = Number(process.env.PORT) || 8000; // Get the port from environment variables or use 8000 as default

	app.use(express.json());
	app.use(bodyParser.json()); // Use body-parser middleware to parse JSON requests

	const gqlServer = new ApolloServer({
		typeDefs: `
            type Query{
                hello:String
            }
        
        `, // Define your GraphQL schema hereF
		resolvers: {
        Query: {
            hello: () => {
                return "Hello, world!";
            }
        }
        }, // Define your resolvers here
	});

	await gqlServer.start(); // Start the ApolloServer

	app.use("/graphql", expressMiddleware(gqlServer)); // Use the express middleware for the ApolloServer

	app.listen(PORT, () => {
		console.log(`Server is running at http://localhost:${PORT}`); // Log the server start message
	});
}

init(); // Initialize the server
