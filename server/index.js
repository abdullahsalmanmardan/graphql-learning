const express = require("express");
const { ApolloServer } = require("@apollo/server");
const bodyParser = require("body-parser");
const cors = require("cors");
const { expressMiddleware } = require("@apollo/server/express4");
const { default: axios } = require("axios");

async function startServer() {
  const app = express();
  // initialize the server.
  // server ko pata hona chahiyay ke kia kia user karo gay.
  const server = new ApolloServer({
    // This is where we define our GraphQL schema and resolvers
    // if we want to fetch something from graphql server we use query.
    // if we want to send something to graphql server we use mutation.
    typeDefs: `
                type User{
                  id: ID!
                  name: String!
                  email: String!
                  username: String!
                  phone: String!,
                  website: String!
                }
                type TODO{
                  id: ID!
                  title: String!
                  completed: Boolean!
                  user: User
                }
                type Query{
                  getTodos: [TODO]
                  getAllUsers: [User]
                  getUser(id: ID!): User
                }
                  `,
    // logic will be in resolvers
    resolvers: {
      // yaha hum dynamic user find karin gay
      TODO: {
        user: async (todo) => {
          const response = await axios.get(
            `https://jsonplaceholder.typicode.com/users/${todo.userId}`
          );

          return response.data;
        },
      },
      Query: {
        // getTodos: () => [{ id: 1, title: "something", completed: true }],
        getTodos: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,

        getAllUsers: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
        // this will fetch the single user.
        getUser: async (parent, { id }) => {
          const response = await axios.get(
            `https://jsonplaceholder.typicode.com/users/${id}`
          );

          return response.data;
        },
      },
    },
  });

  app.use(cors());
  app.use(bodyParser.json());

  // staring graphql server
  await server.start();
  // when it hits this route, graph ql will handle this
  app.use("/graphql", expressMiddleware(server));

  app.listen({ port: 8000 }, () => {
    console.log(
      `��� Server ready at http://localhost:8000${server.graphqlPath}`
    );
  });
}

startServer();
