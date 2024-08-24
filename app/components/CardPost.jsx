import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Button,
} from "react-native";
import { Avatar } from "@ui-kitten/components";
import { SimpleLineIcons, EvilIcons, Ionicons } from "@expo/vector-icons";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { useNavigation } from "@react-navigation/native";
import { TouchableWeb } from "@ui-kitten/components/devsupport";
import * as ImagePicker from "expo-image-picker";

const LIKE_POST = gql`
  mutation LikePost($fields: LikePostField) {
    likePost(fields: $fields)
  }
`;

const ADD_POST = gql`
  mutation AddPost($fields: AddPostField) {
    addPost(fields: $fields) {
      _id
      content
      imgUrl
      createdAt
      updatedAt
    }
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
  const [image, setImage] = useState(null);
  const [textPost, setTextPost] = useState("");
  const navigation = useNavigation();
  const [reload, { data, loading, error }] = useLazyQuery(GET_ALL_POST);
  const [funcAddLike] = useMutation(LIKE_POST, {
    refetchQueries: [GET_ALL_POST],
  });

  const [funcAddPost] = useMutation(ADD_POST, {
    refetchQueries: [GET_ALL_POST],
    onCompleted: () => {
      setTextPost("");
      setImage(null);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmitEditing = () => {
    if (textPost.trim().length > 0) {
      post();
    }
  };

  async function post() {
    try {
      await funcAddPost({
        variables: {
          fields: {
            content: textPost,
            imgUrl: image || "",
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

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
      console.error(error);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Avatar
            source={require("../assets/logos.png")}
            style={styles.avatar}
          />
          <TextInput
            style={styles.input}
            placeholder="What do you think?"
            placeholderTextColor="#888"
            onSubmitEditing={handleSubmitEditing}
            value={textPost}
            onChangeText={(item) => setTextPost(item)}
          />
        </View>
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
        ListHeaderComponent={
          <>
            <View style={styles.inputContainer}>
              <Avatar
                source={require("../assets/logos.png")}
                style={styles.avatar}
              />
              <TextInput
                style={styles.input}
                placeholder="What do you think?"
                placeholderTextColor="#888"
                onSubmitEditing={handleSubmitEditing}
                value={textPost}
                onChangeText={(item) => setTextPost(item)}
              />
              <TouchableWeb onPress={pickImage}>
                <Ionicons
                  name="image-outline"
                  size={40}
                  style={{ marginLeft: 4 }}
                />
              </TouchableWeb>
            </View>
            {image && <Image source={{ uri: image }} style={styles.image} />}
          </>
        }
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
                <Text style={styles.commentHeader}> Latest Comment: </Text>
                <View style={styles.commentContainer}>
                  <Text style={styles.commentContent}>
                    {item.comments[item.comments.length - 1]?.content}
                  </Text>
                  <Text style={styles.commentUsername}>
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    width: "100%",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 10,
  },
  header: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
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
