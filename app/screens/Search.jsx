import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { gql, useLazyQuery } from "@apollo/client";
import { TouchableOpacity } from "react-native-gesture-handler";

const SEARCH = gql`
  query SearchUserByUsername($username: String!) {
    searchUserByUsername(username: $username) {
      _id
      name
      username
      followers {
        _id
        name
        username
        email
        password
      }
      followings {
        _id
        name
        username
        email
        password
      }
    }
  }
`;

const Search = ({ navigation }) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, { data, loading, error }] = useLazyQuery(SEARCH);
  const [filteredData, setFilteredData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (data) {
      setFilteredData(data.searchUserByUsername || []);
      setIsSearching(false);
    }
  }, [data]);

  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (searchValue) {
      setIsSearching(true);

      typingTimeoutRef.current = setTimeout(() => {
        searchQuery({ variables: { username: searchValue } });
      }, 300);
    } else {
      setFilteredData([]);
      setIsSearching(false);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [searchValue, searchQuery]);

  const handleSearch = (text) => {
    setSearchValue(text);
  };

  if (isSearching && !loading && filteredData.length === 0) {
    return (
      <View style={styles.container}>
        <SearchBar
          placeholder="Search Here..."
          lightTheme
          round
          containerStyle={{
            backgroundColor: "#e0e0e0",
            borderRadius: 200,
            marginHorizontal: 30,
            padding: 1,
            marginTop: 20,
            borderTopWidth: "0",
            borderBottomWidth: "0",
          }}
          inputContainerStyle={{
            backgroundColor: "#e0e0e0",
          }}
          inputStyle={styles.searchInput}
          value={searchValue}
          onChangeText={handleSearch}
          autoCorrect={false}
          autoFocus={false}
        />
        <Text style={styles.noResultsText}>No results found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search Here..."
        lightTheme
        round
        containerStyle={{
          backgroundColor: "#e0e0e0",
          borderRadius: 200,
          marginHorizontal: 30,
          padding: 1,
          marginTop: 20,
          borderTopWidth: "0",
          borderBottomWidth: "0",
        }}
        inputContainerStyle={{
          backgroundColor: "#e0e0e0",
        }}
        inputStyle={styles.searchInput}
        value={searchValue}
        onChangeText={handleSearch}
        autoCorrect={false}
        autoFocus={true}
      />
      {isSearching && loading && (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      )}
      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              navigation.navigate("Profile", {
                userId: item._id,
              });
            }}
          >
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemUsername}>@{item.username}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchInput: {
    fontSize: 16,
    color: "#333",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 20,
    marginHorizontal: 40,
  },
  item: {
    marginTop: 20,
    marginVertical: 5,
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },
  itemUsername: {
    fontSize: 10,
    color: "#666",
    marginTop: 10,
    marginLeft: 12,
  },
  noResultsText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 20,
  },
});
