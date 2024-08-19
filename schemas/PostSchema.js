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

  type Query {
    posts: [Post]
  }
  
  input addPostField {
    content: String!
    tags: [String]
    imgUrl: String
    authorId: ID
    createdAt: String
    updatedAt: String 
  }

  input commentPostField {
    content: String!
    username: String!
    createdAt: String!
    updatedAt: String!
  }

  input likePostField {
    username: String!
    createdAt: String!
    updatedAt: String!
  }

  type Mutation {
    addPost(fields: addPostField) : Post
    commentPost(fields: commentPostField): Comment
    likePost(fields: likePostField): Like
  }
`;

const resolversPost = {
  Query: {
    posts: async () => {
      console.log("get Posts ");
    },
  },
  Mutation: {
    addPost: async (parant, args) => {
      console.log(args);
    },
    commentPost: async (parent, args) => {
      console.log(args);
    },
  },
};

module.exports = { resolversPost, typeDefsPost };
