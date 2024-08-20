const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/mongoConfig");
const { hashingPassword, comparePassword } = require("../helpers/bcrypt");
const { GraphQLError } = require("graphql");
const { signToken } = require("../helpers/jwt");
const typeDefsUser = `#graphql
  type User {
    _id: ID
    name: String
    username: String!
    email: String!
    password: String
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

  type responseLogin {
    message: String!
    access_token: String!
  }

  type Query {
    users: [User]
    searchUserById(_id: String): User
    searchUserByUsername: [User]
  }

  type Mutation {
  register(fields: registerField) : String
  login(fields: loginField) : responseLogin
  }


`;

const resolversUser = {
  Query: {
    users: async () => {
      try {
        const db = getDatabase();
        const users = db.collection("users");

        const user = await users.find().toArray();
        return user;
      } catch (error) {
        console.log(error);
      }
    },

    searchUserById: async (parent, args) => {
      try {
        const db = getDatabase();
        const users = db.collection("users");

        const user = await users.findOne({
          _id: new ObjectId(args._id),
        });

        if (!user) {
          throw new GraphQLError("User not Found", {
            extensions: {
              code: "NOT FOUND",
              http: { status: 4040 },
            },
          });
        }

        user.password = null;
        return user;
      } catch (error) {
        console.log(error);
      }
    },
  },

  Mutation: {
    register: async (parent, args) => {
      const { name, username, email, password } = args.fields;
      try {
        if (!args) {
          throw new GraphQLError("invalid input", {
            extensions: {
              code: "BAD REQUEST",
              http: { status: 400 },
            },
          });
        }
        const db = getDatabase();
        const users = db.collection("users");

        await users.insertOne({
          name,
          username,
          email,
          password: hashingPassword(password),
        });

        return "Success Create User";
      } catch (error) {
        console.log(error);
      }
    },

    login: async (parent, args) => {
      try {
        if (!args.fields) {
          throw new GraphQLError("invalid input", {
            extensions: {
              code: "BAD REQUEST",
              http: { status: 400 },
            },
          });
        }
        const { email, password } = args.fields;

        db = getDatabase();
        const users = db.collection("users");

        const user = await users.findOne({
          email,
        });

        if (!user) {
          throw new GraphQLError("User not found", {
            extensions: {
              code: "NOT FOUND",
              http: { status: 404 },
            },
          });
        }

        if (!comparePassword(password, user.password)) {
          throw new GraphQLError("Username or Password Doesn't Match", {
            extensions: {
              code: "BAD REQUEST",
              http: { status: 404 },
            },
          });
        }

        const payload = {
          id: user._id,
          username: user.username,
          email: user.email,
        };

        const token = signToken(payload);

        console.log(token);
        return {
          message: "Login Successfully",
          access_token: token,
        };
      } catch (error) {
        console.log(error);
      }
    },
  },
};

module.exports = {
  typeDefsUser,
  resolversUser,
};
