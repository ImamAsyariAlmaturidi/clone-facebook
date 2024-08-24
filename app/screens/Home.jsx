import React from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CardPost from "../components/CardPost";
import Header from "../components/Header";
import Post from "../components/Post";

const Home = ({ navigation }) => {
  return (
    <SafeAreaView
      style={{
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
            marginTop: 20,
          }}
        >
          <CardPost />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
