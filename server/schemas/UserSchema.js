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
    followers: [User]
    followings: [User]
  }


  input RegisterField {
    name: String!
    username: String!
    email: String!
    password: String!
 }

  input LoginField {
    email: String!
    password: String!
  }

  type ResponseLoginField {
    message: String!
    access_token: String!
  }

  type Query {
    users: [User]
    searchUserById: User
    searchUserByUsername(username: String!): [User]
  }

  type Mutation {
  register(fields: RegisterField) : String
  login(fields: LoginField) : ResponseLoginField
  }


`;

const resolversUser = {
  Query: {
    users: async () => {
      try {
        const db = getDatabase();
        const users = db.collection("users");

        const agg = [
          {
            $lookup: {
              from: "follows",
              localField: "_id",
              foreignField: "followingId",
              as: "followings",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "followings.followerId",
              foreignField: "_id",
              as: "followings",
            },
          },
          {
            $project: {
              password: 0,
              "followings.password": 0,
            },
          },
          {
            $lookup: {
              from: "follows",
              localField: "_id",
              foreignField: "followerId",
              as: "followers",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "followers.followingId",
              foreignField: "_id",
              as: "followers",
            },
          },
          {
            $project: {
              "followers.password": 0,
            },
          },
        ];

        const user = await users.aggregate(agg).toArray();

        return user;
      } catch (error) {
        throw error;
      }
    },

    searchUserById: async (parent, args, context) => {
      const auth = await context.auth();
      try {
        const db = getDatabase();
        const users = db.collection("users");

        const agg = [
          {
            $match: {
              _id: new ObjectId(auth.id),
            },
          },
          {
            $lookup: {
              from: "follows",
              localField: "_id",
              foreignField: "followingId",
              as: "followings",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "followings.followerId",
              foreignField: "_id",
              as: "followings",
            },
          },
          {
            $project: {
              password: 0,
              "followings.password": 0,
            },
          },
          {
            $lookup: {
              from: "follows",
              localField: "_id",
              foreignField: "followerId",
              as: "followers",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "followers.followingId",
              foreignField: "_id",
              as: "followers",
            },
          },
          {
            $project: {
              "followers.password": 0,
            },
          },
        ];

        const user = await users.aggregate(agg).toArray();

        if (user.length < 0) {
          throw new GraphQLError("User not Found", {
            extensions: {
              code: "NOT FOUND",
              http: { status: 404 },
            },
          });
        }

        return user[0];
      } catch (error) {
        throw error;
      }
    },

    searchUserByUsername: async (parent, args) => {
      const { username } = args;
      try {
        const db = getDatabase();
        const users = db.collection("users");

        const agg = [
          // {
          //   $match: {
          //     _id: new ObjectId("66c4741df1891494cee9219b"),
          //   },
          // },
          {
            $lookup: {
              from: "follows",
              localField: "_id",
              foreignField: "followingId",
              as: "followings",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "followings.followerId",
              foreignField: "_id",
              as: "followings",
            },
          },
          {
            $project: {
              password: 0,
              "followings.password": 0,
            },
          },
          // {
          //   $match: {
          //     _id: new ObjectId("66c4741df1891494cee9219b"),
          //   },
          // },
          {
            $lookup: {
              from: "follows",
              localField: "_id",
              foreignField: "followerId",
              as: "followers",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "followers.followingId",
              foreignField: "_id",
              as: "followers",
            },
          },
          {
            $project: {
              "followers.password": 0,
            },
          },
          {
            $match: {
              $or: [
                {
                  name: {
                    $regex: username,
                  },
                },
                {
                  username: {
                    $regex: username,
                  },
                },
              ],
            },
          },
        ];

        const user = await users.aggregate(agg).toArray();
        if (user <= 0) {
          throw new GraphQLError("Username or Name not found", {
            extensions: {
              code: "NOT FOUND",
              http: { status: 404 },
            },
          });
        }

        return user;
      } catch (error) {
        throw error;
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
        throw error;
      }
    },

    login: async (parent, args) => {
      const { email, password } = args.fields;
      try {
        if (!args.fields) {
          throw new GraphQLError("invalid input", {
            extensions: {
              code: "BAD REQUEST",
              http: { status: 400 },
            },
          });
        }

        db = getDatabase();
        const users = db.collection("users");

        const user = await users.findOne({
          email,
        });

        if (!user) {
          throw new GraphQLError("Invalid Email OR Password", {
            extensions: {
              code: "UNAUTHENTICATED",
              http: { status: 401 },
            },
          });
        }

        if (!comparePassword(password, user.password)) {
          throw new GraphQLError("Invalid Email OR Password", {
            extensions: {
              code: "UNAUTHENTICATED",
              http: { status: 401 },
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
        throw error;
      }
    },
  },
};

module.exports = {
  typeDefsUser,
  resolversUser,
};
