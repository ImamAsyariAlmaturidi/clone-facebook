import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Avatar } from "@ui-kitten/components";
import { SimpleLineIcons, EvilIcons } from "@expo/vector-icons";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { useNavigation } from "@react-navigation/native";
import { TouchableWeb } from "@ui-kitten/components/devsupport";

const LIKE_POST = gql`
  mutation LikePost($fields: LikePostField) {
    likePost(fields: $fields)
  }
`;

const GET_ALL_POST = gql`
  query Posts {
    posts {
      _id
      content
      imgUrl
      authorId
      comments {
        content
        username
        createdAt
      }
      likes {
        username
        createdAt
      }
      createdAt
      author {
        _id
        name
        username
        email
      }
    }
  }
`;

const CardPost = () => {
  const navigation = useNavigation();
  const [reload, { data, loading, error }] = useLazyQuery(GET_ALL_POST);
  const [funcAddLike] = useMutation(LIKE_POST, {
    refetchQueries: [GET_ALL_POST],
  });

  const showDetail = (
    postId,
    author,
    content,
    createdAt,
    imgUrl,
    totalLikes,
    totalComments
  ) => {
    navigation.navigate("Detail", {
      postId,
      author,
      content,
      createdAt,
      imgUrl,
      totalLikes,
      totalComments,
    });
  };

  const like = async (postId) => {
    try {
      await funcAddLike({
        variables: {
          fields: {
            postId,
          },
        },
      });

      await reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <FlatList
          data={Array.from({ length: 5 })}
          renderItem={() => (
            <View style={styles.postContainer}>
              <ShimmerPlaceHolder
                style={styles.avatar}
                autoRun
                visible={false}
              />
              <View style={styles.textContainer}>
                <ShimmerPlaceHolder
                  style={styles.textTitle}
                  autoRun
                  visible={false}
                />
                <ShimmerPlaceHolder
                  style={styles.textContent}
                  autoRun
                  visible={false}
                />
                <ShimmerPlaceHolder
                  style={styles.imagePlaceholder}
                  autoRun
                  visible={false}
                />
                <View style={styles.actionsContainer}>
                  <ShimmerPlaceHolder
                    style={styles.actionPlaceholder}
                    autoRun
                    visible={false}
                  />
                  <ShimmerPlaceHolder
                    style={styles.actionPlaceholder}
                    autoRun
                    visible={false}
                  />
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Terjadi kesalahan saat memuat postingan...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.postContainer}>
            <View style={styles.header}>
              <Avatar
                source={require("../assets/logos.png")}
                style={styles.avatar}
              />
              <View style={styles.headerText}>
                <Text style={styles.authorName}>{item.author?.name}</Text>
                <Text style={styles.content} numberOfLines={3}>
                  {item.content}
                </Text>
                <Text style={styles.date}>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : "Sekarang"}
                </Text>
              </View>
            </View>
            {item.imgUrl && (
              <TouchableWeb onPress={() => showDetail(item._id)}>
                <Image style={styles.image} source={{ uri: item.imgUrl }} />
              </TouchableWeb>
            )}
            <View style={styles.actionsContainer}>
              <TouchableWeb
                style={styles.actionItem}
                onPress={() => like(item._id)}
              >
                <SimpleLineIcons name="like" size={24} color="black" />
                <Text style={styles.actionText}>{item.likes.length}</Text>
              </TouchableWeb>
              <TouchableWeb
                style={styles.actionItem}
                onPress={() => showDetail(item._id)}
              >
                <EvilIcons name="comment" size={30} color="black" />
                <Text style={styles.actionText}>{item.comments.length}</Text>
              </TouchableWeb>
            </View>
            {item.comments.length > 0 && (
              <View style={styles.commentSection}>
                <TouchableWeb>
                  <Text style={styles.commentHeader}> Latest Comment: </Text>
                </TouchableWeb>
                <View
                  style={styles.commentContainer}
                  onPress={() => showDetail(item._id)}
                >
                  <Text
                    style={styles.commentContent}
                    onPress={() => showDetail(item._id)}
                  >
                    {item.comments[item.comments.length - 1]?.content}
                  </Text>
                  <Text
                    style={styles.commentUsername}
                    onPress={() => showDetail(item._id)}
                  >
                    {item.comments[item.comments.length - 1]?.username}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    padding: 10,
  },
  postContainer: {
    backgroundColor: "#FFFFFF",
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    paddingBottom: 15,
  },
  header: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
  },
  authorName: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
  },
  content: {
    fontSize: 16,
    color: "#666",
    marginVertical: 5,
  },
  date: {
    fontSize: 14,
    color: "#999",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 8,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#333",
  },
  commentSection: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  commentHeader: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  commentContainer: {
    backgroundColor: "#F1F1F1",
    borderRadius: 5,
    padding: 10,
  },
  commentContent: {
    fontSize: 14,
    color: "#333",
  },
  commentUsername: {
    fontSize: 12,
    color: "#777",
    marginTop: 5,
  },
  textContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  textTitle: {
    width: 200,
    height: 20,
    borderRadius: 4,
    marginBottom: 8,
  },
  textContent: {
    width: "80%",
    height: 14,
    borderRadius: 4,
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  actionPlaceholder: {
    width: 80,
    height: 20,
    borderRadius: 4,
    marginHorizontal: 10,
  },
  errorText: {
    fontSize: 16,
    color: "#FF0000",
    textAlign: "center",
    marginTop: 20,
  },
});

export default CardPost;
