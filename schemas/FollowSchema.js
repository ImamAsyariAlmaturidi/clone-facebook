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
    createdAt: String!
    updatedAt: String!
  }

  type Mutation {
    follow(fields: addFollowField): Follow
  }
`;
const resolversFollow = {
  Mutation: {
    follow: (parent, args) => {
      console.log(args);
    },
  },
};

module.exports = { resolversFollow, typeDefsFollow };
