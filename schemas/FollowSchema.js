const { getDatabase } = require("../config/mongoConfig");

const typeDefsFollow = `#graphql

  type Follow {
    _id: ID
    followingId: ID
    followerId: ID
    createdAt: String
    updatedAt: String
  }

  input addFollowField {
    followingId: ID!
    followerId: ID!
  }

  type Mutation {
    follow(fields: addFollowField): Follow
  }
`;
const resolversFollow = {
  Mutation: {
    follow: async (parent, args) => {
      const { followingId, followerId } = args.fields;
      try {
        const db = getDatabase();
        const follows = db.collection("follows");

        const follow = await follows.insertOne({
          followingId,
          followerId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const result = await follows.findOne({
          _id: follow.insertedId,
        });
        return result;
      } catch (error) {
        console.log(error);
      }
    },
  },
};

module.exports = { resolversFollow, typeDefsFollow };
