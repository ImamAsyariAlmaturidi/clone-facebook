require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { mongoConnect } = require("./config/mongoConfig");
const { typeDefsUser, resolversUser } = require("./schemas/UserSchema");
const { typeDefsPost, resolversPost } = require("./schemas/PostSchema");
const { typeDefsFollow, resolversFollow } = require("./schemas/FollowSchema");
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
    });

    console.log(`🚀  Server ready at: ${url}`);
  } catch (error) {
    console.log(error);
  }
}

running();
