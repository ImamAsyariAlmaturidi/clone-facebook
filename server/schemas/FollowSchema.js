const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/mongoConfig");
const { GraphQLError } = require("graphql");
const typeDefsFollow = `#graphql

  type Follow {
    _id: ID
    followingId: ID
    followerId: ID
    createdAt: String
    updatedAt: String
  }

  input AddFollowField {
    followerId: ID!
  }

  type Mutation {
    follow(fields: AddFollowField): Follow
  }
`;
const resolversFollow = {
  Mutation: {
    follow: async (parent, args, context) => {
      const auth = await context.auth();
      const { followerId } = args.fields;
      try {
        const db = getDatabase();
        const follows = db.collection("follows");

        const users = db.collection("users");
        const user = await users.findOne({
          _id: new ObjectId(followerId),
        });

        if (followerId === auth.id) {
          throw new GraphQLError("Cannot follow your self!", {
            extensions: {
              code: "BAD REQUEST",
              http: { status: 400 },
            },
          });
        }

        if (!user) {
          throw new GraphQLError("User not found", {
            extensions: {
              code: "NOT FOUND",
              http: { status: 404 },
            },
          });
        }

        const existsFollows = await follows.findOne({
          followerId: new ObjectId(followerId),
          followingId: new ObjectId(auth.id),
        });

        if (existsFollows) {
          throw new GraphQLError("Already Followed", {
            extensions: {
              code: "BAD REQUEST",
              http: { status: 400 },
            },
          });
        }

        const follow = await follows.insertOne({
          followingId: new ObjectId(auth.id),
          followerId: new ObjectId(followerId),
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const result = await follows.findOne({
          _id: follow.insertedId,
        });

        return result;
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { resolversFollow, typeDefsFollow };
