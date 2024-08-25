import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Avatar } from "@ui-kitten/components";
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { TouchableWeb } from "@ui-kitten/components/devsupport";

const FOLLOW = gql`
  mutation Follow($fields: AddFollowField) {
    follow(fields: $fields) {
      _id
    }
  }
`;

const GET_PROFILE = gql`
  query GetProfile {
    getProfile {
      _id
      name
      username
      email
      followers {
        _id
      }
      followings {
        _id
      }
    }
  }
`;

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

  const { data: profileData, loading: profileLoading } = useQuery(GET_PROFILE);
  const [funcGet, { data, loading, error }] = useLazyQuery(GET_ALL_POST);

  const [funcFollow] = useMutation(FOLLOW, {
    refetchQueries: [GET_ALL_POST],
  });

  async function get() {
    try {
      await funcGet();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    get();
  }, []);
  const [funcAddLike] = useMutation(LIKE_POST, {
    refetchQueries: [GET_ALL_POST],
  });

  const [funcAddPost] = useMutation(ADD_POST, {
    refetchQueries: [GET_ALL_POST],
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
    if (textPost.trim()) {
      post();
    }
  };

  const post = async () => {
    try {
      await funcAddPost({
        variables: {
          fields: {
            content: textPost,
            imgUrl: image || "",
          },
        },
      });
      setImage("");
      setTextPost("");
    } catch (error) {
      console.log(error);
    }
  };

  const showDetail = (postId) => {
    navigation.navigate("Detail", { postId });
  };

  const like = async (postId) => {
    try {
      await funcAddLike({ variables: { fields: { postId } } });
    } catch (error) {
      console.log("Like error:", error.message);
    }
  };

  if (loading || profileLoading) {
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
            onChangeText={(text) => setTextPost(text)}
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
                onChangeText={(text) => setTextPost(text)}
              />
              <TouchableOpacity onPress={pickImage}>
                <Ionicons
                  name="image-outline"
                  size={40}
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>
            </View>
            <View style={{ borderBottomWidth: 2, borderColor: "gray" }}>
              {image && <Image source={{ uri: image }} style={styles.image} />}
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Profile", {
                    userId: item.author?._id,
                  });
                }}
              >
                <Avatar
                  source={require("../assets/logos.png")}
                  style={styles.avatar}
                />
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Profile", {
                      userId: item.author?._id,
                    });
                  }}
                  style={styles.authorName}
                >
                  <Text style={{ fontSize: 15 }}>{item.author?.name}</Text>
                </TouchableOpacity>
              </TouchableOpacity>

              <View style={styles.headerText}>
                <Text style={styles.content} numberOfLines={3}>
                  {item.content}
                </Text>
                <Text style={styles.date}>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString("id-ID", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : "Now"}
                </Text>
              </View>
            </View>
            {item.imgUrl && (
              <TouchableWeb onPress={() => showDetail(item._id)}>
                <Image style={styles.image} source={{ uri: item.imgUrl }} />
              </TouchableWeb>
            )}
            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => like(item._id)}
              >
                <SimpleLineIcons name="like" size={20} color="blue" />
                <Text style={styles.actionText}>{item.likes.length}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => showDetail(item._id)}
              >
                <SimpleLineIcons name="bubble" size={20} color="blue" />
                <Text style={styles.actionText}>{item.comments.length}</Text>
              </TouchableOpacity>
            </View>
            {item.comments.length > 0 && (
              <TouchableOpacity
                onPress={() => showDetail(item._id)}
                style={styles.commentSection}
              >
                <Text style={styles.commentHeader}> Latest Comment: </Text>
                <View style={styles.commentContainer}>
                  <Text style={styles.commentContent}>
                    {item.comments[item.comments.length - 1]?.content}
                  </Text>
                  <Text style={styles.commentUsername}>
                    {item.comments[item.comments.length - 1]?.username}
                  </Text>
                </View>
              </TouchableOpacity>
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
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorName: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
  },
  followText: {
    paddingTop: 3,
    color: "blue",
    fontWeight: "bold",
    letterSpacing: 2,
  },
  content: {
    fontSize: 25,
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
