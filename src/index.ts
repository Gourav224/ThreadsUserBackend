import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express"; // Import express from express
import prisma from "./lib/db";

async function init() {
    const app = express(); // Create an instance of express
    const PORT = Number(process.env.PORT) || 8000; // Get the port from environment variables or use 8000 as default

    app.use(express.json()); // Use express.json() to parse JSON requests

    const gqlServer = new ApolloServer({
        typeDefs: `
            type User {
                id: ID!
                firstName: String!
                lastName: String
                email: String!
                password: String!
                salt: String!
            }

            type Query {
                hello: String
                getUsers: [User!]!  # This will return a list of User objects
            }

            type Mutation {
                createUser(firstName: String!, lastName: String!, email: String!, password: String!): User
            }
        `,
        resolvers: {
            Query: {
                hello: () => "Hello, world!",
                getUsers: async () => {
                    // Fetch all users from the database
                    const users = await prisma.user.findMany();
                    return users;
                },
            },
            Mutation: {
                createUser: async (_, args) => {
                    const { firstName, lastName, email, password } = args;
                    const user = await prisma.user.create({
                        data: {
                            firstName,
                            lastName: lastName ?? "",
                            email,
                            password,
                            salt: "testm", // Assuming you plan to add a real salt later
                        },
                    });
                    return user;
                },
            },
        },
    });

    await gqlServer.start(); // Start the ApolloServer

    app.use(
        "/graphql",
        expressMiddleware(gqlServer, { context: async () => ({}) })
    ); // Use express middleware for ApolloServer

    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`); // Log the server start message
    });
}

init(); // Initialize the server
