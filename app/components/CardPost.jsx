import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Platform,
} from "react-native";
import { Avatar, Button, Icon, Layout, Spinner } from "@ui-kitten/components";
import { SimpleLineIcons } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import { useQuery, gql } from "@apollo/client";
import { SafeAreaView } from "react-native-safe-area-context";

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
const CardPost = () => {
  const { data, loading, error } = useQuery(GET_ALL_POST);
  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Erorr....</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        marginTop: 10,
      }}
    >
      <FlatList
        ItemSeparatorComponent={
          Platform.OS !== "android" &&
          (({ highlighted }) => (
            <View
              style={[styles.separator, highlighted && { marginLeft: 0 }]}
            />
          ))
        }
        data={data.posts}
        renderItem={({ item }) => (
          <>
            <View
              key={item._id}
              style={{
                display: "flex",
                flexDirection: "row",
                padding: 10,
                borderTopWidth: 1,
                borderColor: "gray",
                marginBottom: 10,
              }}
            >
              <Avatar
                source={require("../assets/logos.png")}
                style={{ marginRight: 10 }}
              />
              <View>
                <Text style={{ fontWeight: "400", fontSize: 20 }}>
                  {item.author.name} -{" "}
                  <Text
                    style={{
                      fontWeight: "light",
                      fontSize: 13,
                      maxWidth: "90%",
                    }}
                    numberOfLines={5}
                  >
                    {item.content}
                  </Text>
                </Text>
                <Text style={{ fontWeight: "200" }}>
                  {new Date(item.createdAt).toLocaleString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </Text>
              </View>
            </View>
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {item.imgUrl.length > 0 ? (
                  <>
                    <Image
                      width={400}
                      height={300}
                      source={{
                        uri: item.imgUrl,
                      }}
                    ></Image>
                  </>
                ) : (
                  ""
                )}
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <View
                style={{
                  height: 50,
                  padding: 10,
                }}
              >
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <SimpleLineIcons
                    color="black"
                    size={28}
                    name="like"
                    style={{ marginTop: 2 }}
                  />
                  <Text style={{ marginTop: 10, marginLeft: 10 }}>
                    {" "}
                    {item.likes.length}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  height: 50,
                  padding: 10,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <EvilIcons color="black" size={38} name="comment" />
                  <Text style={{ marginTop: 10 }}> {item.comments.length}</Text>
                </View>
              </View>
            </View>
          </>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    margin: 2,
    backgroundColor: "white",
    borderColor: "white",
  },
  indicator: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CardPost;
