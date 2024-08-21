require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { mongoConnect, getDatabase } = require("./config/mongoConfig");
const { typeDefsUser, resolversUser } = require("./schemas/UserSchema");
const { typeDefsPost, resolversPost } = require("./schemas/PostSchema");
const { typeDefsFollow, resolversFollow } = require("./schemas/FollowSchema");
const { GraphQLError } = require("graphql");
const { verifyToken } = require("./helpers/jwt");
const { ObjectId } = require("mongodb");

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs: [typeDefsUser, typeDefsPost, typeDefsFollow],
  resolvers: [resolversUser, resolversPost, resolversFollow],
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
async function running() {
  try {
    await mongoConnect();
    const { url } = await startStandaloneServer(server, {
      listen: { port: 3000 },
      context: async ({ req, res }) => {
        return {
          auth: async () => {
            const authorizaition = req.headers.authorization;
            if (!authorizaition) {
              throw new GraphQLError("Unauthorized", {
                extensions: {
                  code: "UNAUTHORIZED",
                  http: { status: 401 },
                },
              });
            }
            const token = authorizaition.split(" ")[1];
            if (!token) {
              throw new GraphQLError("Invalid Token", {
                extensions: {
                  code: "UNAUTHORIZED",
                  http: { status: 401 },
                },
              });
            }

            const payload = verifyToken(token);

            const db = getDatabase();
            const users = db.collection("users");

            const user = await users.findOne({
              _id: new ObjectId(payload.id),
            });

            if (!user) {
              throw new GraphQLError("Invalid Token", {
                extensions: {
                  code: "UNAUTHORIZED",
                  http: { status: 401 },
                },
              });
            }

            return payload;
          },
        };
      },
    });

    console.log(`🚀  Server ready at: ${url}`);
  } catch (error) {
    console.log(error);
  }
}

running();
