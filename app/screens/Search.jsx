import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { gql, useLazyQuery } from "@apollo/client";
import debounce from "lodash.debounce";
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

const Item = ({ name, username }) => (
  <TouchableOpacity style={styles.item}>
    <Text style={styles.itemName}>{name}</Text>
    <Text style={styles.itemUsername}>@{username}</Text>
  </TouchableOpacity>
);

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchQuery, { data, loading, error }] = useLazyQuery(SEARCH);
  const [filteredData, setFilteredData] = useState([]);

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query) {
        searchQuery({ variables: { username: query } });
      } else {
        setFilteredData([]);
      }
    }, 300),
    [searchQuery]
  );

  useEffect(() => {
    if (data) {
      setFilteredData(data.searchUserByUsername || []);
    }
  }, [data]);

  useEffect(() => {
    debouncedSearch(searchValue);
  }, [searchValue, debouncedSearch]);

  const handleSearch = (text) => {
    setSearchValue(text);
  };

  if (loading)
    return (
      <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
    );

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search Here..."
        lightTheme
        round
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
        inputStyle={styles.searchInput}
        value={searchValue}
        onChangeText={handleSearch}
        autoCorrect={false}
        autoFocus="true"
      />
      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <Item username={item.username} name={item.name} />
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
  searchContainer: {
    backgroundColor: "#e0e0e0",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 20,
  },
  searchInputContainer: {
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
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
  },
  item: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 12,
    marginVertical: 3,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemUsername: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
});
