import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useQuery, useMutation, gql } from "@apollo/client";
import { Avatar } from "@ui-kitten/components";

const GET_PROFILE = gql`
  query SearchUserById($userId: String!) {
    searchUserById(userId: $userId) {
      _id
      name
      username
      email
      followers {
        _id
        name
        username
        email
      }
      followings {
        _id
        name
        email
        username
      }
    }
  }
`;

const FOLLOW = gql`
  mutation Follow($fields: AddFollowField) {
    follow(fields: $fields) {
      _id
    }
  }
`;

const GET_CURRENT_PROFILE = gql`
  query GetProfile {
    getProfile {
      _id
      name
      username
      email
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

const Profile = ({ route }) => {
  const { userId } = route.params;
  const [visible, setVisible] = useState(true);
  const [currentUserId, setCurrentUserId] = useState("");

  const { data: currentUserData, refetch: refetchCurrentProfile } = useQuery(
    GET_CURRENT_PROFILE,
    {
      onCompleted: (data) => {
        setCurrentUserId(data?.getProfile._id);
      },
    }
  );

  const { data, loading, error, refetch } = useQuery(GET_PROFILE, {
    variables: { userId: userId },
  });

  useEffect(() => {
    if (data && currentUserId) {
      if (userId === currentUserId) {
        setVisible(false);
      } else {
        const isFollower = data.searchUserById.followers.some(
          (follower) => follower._id === currentUserId
        );
        setVisible(!isFollower);
      }
    }
  }, [data, currentUserId, userId]);

  const [follow] = useMutation(FOLLOW, {
    onCompleted: async () => {
      setVisible(false);

      await refetch();
    },
    variables: {
      fields: {
        followerId: userId,
      },
    },
  });

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading profile...</Text>
      </View>
    );
  }

  const { searchUserById } = data;

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Avatar
          source={
            searchUserById.imgUrl?.length > 0
              ? { uri: searchUserById.imgUrl }
              : require("../assets/logos.png")
          }
          style={styles.avatar}
        />
        <Text style={styles.username}>{searchUserById.username}</Text>
        <View style={styles.followInfo}>
          <Text style={styles.followText}>
            Following: {searchUserById.followings.length}
          </Text>
          <Text style={styles.followText}>
            Followers: {searchUserById.followers.length}
          </Text>
        </View>
        {visible && (
          <TouchableOpacity style={styles.followButton} onPress={follow}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Followers</Text>
        <FlatList
          data={searchUserById.followers}
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
          data={searchUserById.followings}
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  errorText: {
    fontSize: 18,
    color: "#FF0000",
    textAlign: "center",
  },
  followButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#007bff",
    borderRadius: 5,
  },
  followButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Profile;
