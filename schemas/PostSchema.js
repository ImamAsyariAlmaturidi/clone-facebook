const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/mongoConfig");
const { GraphQLError } = require("graphql");

const typeDefsPost = `#graphql
  type Comment {
    content: String!
    username: String!
    createdAt: String
    updatedAt: String
  }
  type Like {
    username: String!
    createdAt: String
    updatedAt: String
  }

  type Post {
    _id: ID
    content: String!
    tags: [String]
    imgUrl: String
    authorId: ID!
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
  }
  
  input addPostField {
    content: String!
    imgUrl: String!
    authorId: ID!
  }

  input commentPostField {
    content: String!
    username: String!
  }

  input likePostField {
    username: String!
  }

  input idPostField {
    _id: ID!
  }

  type Query {
    posts: [Post]
    getPostById(fields: idPostField) : Post
  }

  type Mutation {
    addPost(fields: addPostField): Post
    commentPost(fields: commentPostField): Comment
    likePost(fields: likePostField): String
  }
`;

const resolversPost = {
  Query: {
    posts: async () => {
      try {
        const db = getDatabase();
        const posts = db.collection("posts");

        const postList = await posts.find().toArray();

        if (!postList) {
          throw new GraphQLError("Post not found", {
            extensions: {
              code: "NOT FOUND",
              http: { status: 404 },
            },
          });
        }
        return postList;
      } catch (error) {
        console.log(error);
      }
    },
    getPostById: async (parent, args) => {
      const { _id } = args.fields;
      try {
        if (!_id) {
          throw new GraphQLError("Invalid input", {
            extensions: {
              code: "Need Specify ID to search by id",
              http: { status: 400 },
            },
          });
        }
        const db = getDatabase();
        const posts = db.collection("posts");

        const post = await posts.findOne({
          _id: new ObjectId(_id),
        });

        if (!post) {
          throw new GraphQLError("Post not found", {
            extensions: {
              code: "NOT FOUND",
              http: { status: 404 },
            },
          });
        }

        return post;
      } catch (error) {
        console.log(error);
      }
    },
  },
  Mutation: {
    addPost: async (parent, args, contextValue) => {
      const auth = await contextValue.auth();
      const { content, imgUrl, authorId } = args.fields;
      try {
        if (!args.fields) {
          throw new GraphQLError("Please Input Mandatory Fields for create", {
            extensions: {
              code: "BAD REQUEST",
              http: { status: 400 },
            },
          });
        }

        const db = getDatabase();
        const posts = db.collection("posts");

        const data = {
          content,
          imgUrl,
          authorId,
          tags: ["javascript", "php", "python"],
          comments: [],
          likes: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const post = await posts.insertOne(data);
        const result = await posts.findOne({
          _id: post.insertedId,
        });

        if (!result) {
          throw new GraphQLError("Post not found", {
            extensions: {
              code: "NOT FOUND",
              http: { status: 404 },
            },
          });
        }

        return result;
      } catch (error) {
        console.log(error);
      }
    },
    commentPost: async (parent, args) => {
      const { content, username } = args.fields;
      try {
        const db = getDatabase();
        const comments = db.collection("comments");
        const comment = await comments.insertOne({
          content,
          username,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        const result = await comments.findOne({
          _id: comment.insertedId,
        });

        if (!result) {
          throw new GraphQLError("Comment not found", {
            extensions: {
              code: "NOT FOUND",
              http: { status: 404 },
            },
          });
        }
        return result;
      } catch (error) {
        console.log(error);
      }
    },
    likePost: async (parent, args) => {
      const { username } = args.fields;
      try {
        if (!username) {
          throw new GraphQLError("Please input mandatory fields", {
            extensions: {
              code: "BAD REQUEST",
              http: { status: 400 },
            },
          });
        }
        const db = getDatabase();
        const likes = db.collection("likes");

        await likes.insertOne({
          username,
        });
        return "Success Like";
      } catch (error) {
        console.log(error);
      }
    },
  },
};

module.exports = { resolversPost, typeDefsPost };
