import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CardPost from "../components/CardPost";
import Header from "../components/Header";
import Post from "../components/Post";
const Home = () => {
  return (
    <SafeAreaView
      style={{
        marginTop: -50,
        backgroundColor: "white",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <Header />
      <View style={{ flex: 1 }}>
        <Post />
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            justifyContent: "center",
          }}
        >
          <CardPost />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
