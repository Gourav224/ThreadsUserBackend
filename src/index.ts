import { expressMiddleware } from "@apollo/server/express4";
import express from "express"; // Import express from express
import createApolloGraphqlServer from "./graphql";

async function init() {
	const app = express(); // Create an instance of express
	const PORT = Number(process.env.PORT) || 8000; // Get the port from environment variables or use 8000 as default

	app.use(express.json()); // Use express.json() to parse JSON requests

	app.use(
		"/graphql",
		expressMiddleware(await createApolloGraphqlServer()),
	); // Use express middleware for ApolloServer

	app.listen(PORT, () => {
		console.log(`Server is running at http://localhost:${PORT}`); // Log the server start message
	});
}

init(); // Initialize the server
