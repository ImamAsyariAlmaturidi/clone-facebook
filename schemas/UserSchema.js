const typeDefsUser = `#graphql
  type User {
    _id: ID
    name: String
    username: String!
    email: String!
    password: String
  }

  type Query {
    users: [User]
    searchUser: [User]
  }

  input registerField {
    name: String!
    username: String!
    email: String!
    password: String!
 }

  input loginField {
    email: String!
    password: String!
  }

  type Mutation {
  register(fields: registerField) : User
  login(fields: loginField) : String
  }
`;

const resolversUser = {
  Query: {
    users: async () => {
      console.log("response data user");
    },
    searchUser: async () => {
      console.log("response one data by user");
    },
  },

  Mutation: {
    register: async (parent, args) => {
      console.log(args);
    },
    login: async (parent, args) => {
      console.log(args);
    },
  },
};

module.exports = {
  typeDefsUser,
  resolversUser,
};
