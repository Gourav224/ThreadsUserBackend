import { ApolloServer } from "@apollo/server";
import { User } from "./user";

async function createApolloGraphqlServer() {
	try {
		const gqlServer = new ApolloServer({
			typeDefs: `
				${User.typeDefs}
	            type Query {
					${User.queries}
	            }
	            type Mutation {
	                ${User.mutations}
	            }
	        `, // Define your GraphQL schema here
			resolvers: {
				Query: {
					...User.resolvers.queries,
				},
				Mutation: {
					...User.resolvers.mutations,
				},
			}, // Define your resolvers here
		});

		await gqlServer.start(); // Start the ApolloServer

		return gqlServer;
	} catch (error) {
		console.error("Error starting Apollo GraphQL server:", error);
		throw error; 
	}
}

export default createApolloGraphqlServer;
