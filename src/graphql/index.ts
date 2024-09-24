import { ApolloServer } from "@apollo/server";
import { User } from "./user";

async function createApolloGraphqlServer() {
	const gqlServer = new ApolloServer({
		typeDefs: `
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
}

export default createApolloGraphqlServer;
