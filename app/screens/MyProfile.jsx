import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Avatar } from "@ui-kitten/components";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";

const GET_PROFILE = gql`
  query GetProfile {
    getProfile {
      _id
      name
      username
      email
      password
      followers {
        _id
        name
        username
        email
      }
      followings {
        _id
        name
        username
        email
      }
    }
  }
`;
const MyProfile = () => {
  const { data, loading, error } = useQuery(GET_PROFILE);

  if (loading)
    return (
      <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
    );
  if (error) {
    return (
      <View>
        <Text>Error...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Avatar
          source={
            data.getProfile.imgUrl?.length > 0
              ? { uri: data.getProfile.imgUrl }
              : require("../assets/logos.png")
          }
          style={styles.avatar}
        />
        <Text style={styles.username}>{data.getProfile.username}</Text>
        <View style={styles.followInfo}>
          <Text style={styles.followText}>
            Following: {data.getProfile.followings.length}
          </Text>
          <Text style={styles.followText}>
            Followers: {data.getProfile.followers.length}
          </Text>
        </View>
      </View>
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>All Post</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  profileInfo: {
    flex: 2,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  username: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333333",
    marginVertical: 8,
  },
  followInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  followText: {
    fontSize: 16,
    color: "#555555",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flex: 4,
    marginTop: 5,
    width: "100%",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 2,
    borderTopColor: "#DDDDDD",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsText: {
    fontSize: 30,
    color: "#333333",
    marginVertical: 4,
    fontWeight: "bold",
    letterSpacing: 10,
  },
  loadingText: {
    fontSize: 18,
    color: "#888888",
  },
  errorText: {
    fontSize: 18,
    color: "#FF0000",
  },
});
export default MyProfile;
