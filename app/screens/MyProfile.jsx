import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useQuery, gql } from "@apollo/client";
import { Avatar } from "@ui-kitten/components";

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
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading profile...</Text>
      </View>
    );
  }

  const { getProfile } = data;

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Avatar
          source={
            getProfile.imgUrl?.length > 0
              ? { uri: getProfile.imgUrl }
              : require("../assets/logos.png")
          }
          style={styles.avatar}
        />
        <Text style={styles.username}>{getProfile.username}</Text>
        <View style={styles.followInfo}>
          <Text style={styles.followText}>
            Following: {getProfile.followings.length}
          </Text>
          <Text style={styles.followText}>
            Followers: {getProfile.followers.length}
          </Text>
        </View>
      </View>
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Followers</Text>
        <FlatList
          data={getProfile.followers}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>{item.name}</Text>
              <Text style={styles.listItemUsername}>@{item.username}</Text>
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
        <Text style={styles.statsText}>Following</Text>
        <FlatList
          data={getProfile.followings}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>{item.name}</Text>
              <Text style={styles.listItemUsername}>@{item.username}</Text>
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  profileInfo: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  username: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
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
  statsContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 2,
    borderTopColor: "#DDDDDD",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsText: {
    fontSize: 24,
    color: "#333333",
    fontWeight: "bold",
    marginVertical: 8,
  },
  listItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
  },
  listItemText: {
    fontSize: 16,
    color: "#333333",
  },
  listItemUsername: {
    fontSize: 14,
    color: "#888888",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#FF0000",
    textAlign: "center",
  },
});

export default MyProfile;
