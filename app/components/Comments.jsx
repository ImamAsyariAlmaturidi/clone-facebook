import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { SimpleLineIcons, EvilIcons } from "@expo/vector-icons";
import { Avatar } from "@ui-kitten/components";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";

const ADD_COMMENT = gql`
  mutation CommentPost($fields: CommentPostField) {
    commentPost(fields: $fields)
  }
`;

const DETAIL_POST = gql`
  query GetPostById($fields: IdPostField) {
    getPostById(fields: $fields) {
      _id
      content
      tags
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      author {
        _id
        name
        username
        email
      }
    }
  }
`;

const Comments = ({ postId }) => {
  const [textComment, setTextComment] = useState("");

  const [funcAddComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [
      {
        query: DETAIL_POST,
        variables: { fields: { _id: postId } },
      },
    ],
    onCompleted: () => {
      setTextComment("");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const [funcDetailId, { loading, error, data }] = useLazyQuery(DETAIL_POST, {
    variables: {
      fields: {
        _id: postId,
      },
    },
  });

  const handleComment = async () => {
    try {
      await funcAddComment({
        variables: {
          fields: {
            commentPostId: postId,
            content: textComment,
          },
        },
      });
      await funcDetailId();
      Keyboard.dismiss();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitEditing = () => {
    if (textComment.trim().length > 0) {
      handleComment();
    }
  };

  useEffect(() => {
    funcDetailId();
  }, [funcDetailId]);

  if (loading) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 75 : 0}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.postContainer}>
            <ShimmerPlaceHolder style={styles.avatar} autoRun visible={true} />
            <View style={styles.headerText}>
              <ShimmerPlaceHolder
                style={styles.authorName}
                autoRun
                visible={true}
              />
              <ShimmerPlaceHolder
                style={styles.contentText}
                autoRun
                visible={true}
              />
              <ShimmerPlaceHolder style={styles.date} autoRun visible={true} />
            </View>
            <ShimmerPlaceHolder style={styles.image} autoRun visible={true} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  const comments = data?.getPostById.comments || [];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 75 : 75}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.postContainer}>
            <View style={styles.header}>
              <Avatar
                source={require("../assets/logos.png")}
                style={styles.avatar}
              />
              <View style={styles.headerText}>
                <Text style={styles.authorName}>
                  {data?.getPostById.author.name}
                </Text>
                <Text style={styles.contentText} numberOfLines={4}>
                  {data?.getPostById.content}
                </Text>
                <Text style={styles.date}>
                  {data?.getPostById.createdAt
                    ? new Date(data?.getPostById.createdAt).toLocaleString(
                        "id-ID",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }
                      )
                    : "Just now"}
                </Text>
              </View>
            </View>
            {data?.getPostById.imgUrl && (
              <Image
                style={styles.image}
                source={{ uri: data?.getPostById.imgUrl }}
              />
            )}
            <View style={styles.actionsContainer}>
              <View style={styles.actionItem}>
                <SimpleLineIcons name="like" size={24} color="black" />
                <Text style={styles.actionText}>
                  {data?.getPostById.likes.length}
                </Text>
              </View>
              <View style={styles.actionItem}>
                <EvilIcons name="comment" size={30} color="black" />
                <Text style={styles.actionText}>
                  {data?.getPostById.comments.length}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.commentSection}>
            {comments.length > 0 ? (
              comments.slice(-7).map((item, index) => (
                <View key={index} style={styles.commentItem}>
                  <Text style={styles.commentContent}>
                    {item.content || "No content"}
                  </Text>
                  <Text style={styles.commentUsername}>
                    {item.username || "Unknown user"}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noComments}>No comments yet</Text>
            )}
          </View>

          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              placeholderTextColor="#888"
              value={textComment}
              onChangeText={setTextComment}
              onSubmitEditing={handleSubmitEditing}
              returnKeyType="send"
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  postContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
  },
  header: {
    flexDirection: "row",
    marginBottom: 10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  authorName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  contentText: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  date: {
    fontSize: 12,
    color: "#999",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 8,
    marginVertical: 10,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#333",
  },
  commentSection: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
  },
  commentItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 8,
  },
  commentContent: {
    fontSize: 15,
    color: "#333",
  },
  commentUsername: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
  commentInputContainer: {
    paddingVertical: 8,
  },
  input: {
    width: "100%",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FAFAFA",
  },
  noComments: {
    textAlign: "center",
    fontSize: 14,
    color: "#888",
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#FF0000",
  },
});

export default Comments;
