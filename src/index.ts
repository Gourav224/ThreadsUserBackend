import { expressMiddleware } from "@apollo/server/express4";
import express from "express"; // Import express from express
import createApolloGraphqlServer from "./graphql";
import UserService from "./services/user";

async function init() {
	try {
		const app = express(); // Create an instance of express
		const PORT = Number(process.env.PORT) || 8000; // Get the port from environment variables or use 8000 as default

		app.use(express.json()); // Use express.json() to parse JSON requests

		app.use(
			"/graphql",
			expressMiddleware(await createApolloGraphqlServer(), {
				context: async ({ req }) => {
					try {
						const token = req.headers['token'] as string;
						const user = UserService.decodeToken(token);
						return { user };
					} catch (error) {
						return {}
					}
				},
			}),
		); // Use express middleware for ApolloServer
		console.log(
			`GraphQL Server is running at http://localhost:${PORT}/graphql`,
		);

		app.listen(PORT, () => {
			console.log(`Server is running at http://localhost:${PORT}`); // Log the server start message
		});
	} catch (error) {
		console.error("Error initializing server:", error);
	}
}

init(); // Initialize the server
