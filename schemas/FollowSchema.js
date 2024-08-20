const { getDatabase } = require("../config/mongoConfig");
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

        const follow = await follows.insertOne({
          followingId: auth.id,
          followerId,
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
