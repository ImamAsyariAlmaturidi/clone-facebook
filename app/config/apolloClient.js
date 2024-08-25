import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Membuat HttpLink untuk endpoint GraphQL
const httpLink = new HttpLink({
  uri: "https://graphql.imam-asyari.online/",
});

// Membuat link context untuk menambahkan header
const authLink = setContext(async (_, { headers }) => {
  // Ambil token dari penyimpanan lokal atau cara lain
  const token = await AsyncStorage.getItem("access_token");

  // Kembalikan header yang harus ditambahkan pada setiap permintaan
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const link = from([authLink, httpLink]);

// Membuat Apollo Client
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

export default client;
