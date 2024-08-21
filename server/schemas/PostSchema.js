const { ObjectId } = require("mongodb");
const { getDatabase } = require("../config/mongoConfig");
const { GraphQLError } = require("graphql");
const redis = require("../config/redisConfig");

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
    author: User
  }
  
  input AddPostField {
    content: String!
    imgUrl: String!
  }

  input CommentPostField {
    commentPostId: ID!
    content: String!
  }

  input IdPostField {
    _id: ID!
  }

  input LikePostField {
    postId: ID!
  }

  type Query {
    posts: [Post]
    getPostById(fields: IdPostField) : Post
  }

  type Mutation {
    addPost(fields: AddPostField): Post
    commentPost(fields: CommentPostField): String
    likePost(fields:  LikePostField): String
  }
`;

const resolversPost = {
  Query: {
    posts: async () => {
      try {
        const db = getDatabase();
        const posts = db.collection("posts");

        const redisCache = await redis.get("posts");

        if (redisCache) {
          return JSON.parse(redisCache);
        }

        const postList = await posts.find().sort({ createdAt: -1 }).toArray();

        if (!postList) {
          throw new GraphQLError("Post not found", {
            extensions: {
              code: "NOT FOUND",
              http: { status: 404 },
            },
          });
        }
        redis.set("posts", JSON.stringify(postList));

        return postList;
      } catch (error) {
        throw error;
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
        throw error;
      }
    },
  },
  Mutation: {
    addPost: async (parent, args, contextValue) => {
      const auth = await contextValue.auth();
      const { content, imgUrl } = args.fields;
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
          authorId: new ObjectId(auth.id),
          tags: ["javascript", "php", "python"],
          comments: [],
          likes: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        console.log(auth.id);
        const post = await posts.insertOne(data);
        const result = await posts.findOne({
          _id: post.insertedId,
        });

        redis.del("posts");

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
        throw error;
      }
    },
    commentPost: async (parent, args, context) => {
      const auth = await context.auth();
      const { content, commentPostId } = args.fields;
      try {
        const db = getDatabase();
        const posts = db.collection("posts");

        const post = await posts.findOne({
          _id: new ObjectId(commentPostId),
        });

        if (!post) {
          throw new GraphQLError("Post not found", {
            extensions: {
              code: "NOT FOUND",
              http: { status: 404 },
            },
          });
        }
        await posts.updateOne(
          {
            _id: new ObjectId(commentPostId),
          },
          {
            $push: {
              comments: {
                content,
                username: auth.username,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
          }
        );
        redis.del("posts");

        return "Comment Success";
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    likePost: async (parent, args, context) => {
      const { postId } = args.fields;
      const auth = await context.auth();
      try {
        if (!auth.username) {
          throw new GraphQLError("Please input mandatory fields", {
            extensions: {
              code: "BAD REQUEST",
              http: { status: 400 },
            },
          });
        }
        const db = getDatabase();
        const posts = db.collection("posts");

        const post = await posts.findOne({
          _id: new ObjectId(postId),
        });

        if (!post) {
          throw new GraphQLError("Post not found", {
            extensions: {
              code: "NOT FOUND",
              http: { status: 404 },
            },
          });
        }
        await posts.updateOne(
          {
            _id: new ObjectId(postId),
          },
          {
            $push: {
              likes: {
                username: auth.username,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            },
          }
        );

        redis.del("posts");
        return "Success Like";
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { resolversPost, typeDefsPost };
