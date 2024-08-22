import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Avatar } from "@ui-kitten/components";
const Post = () => {
  return (
    <View
      style={{
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          padding: 15,
          marginBottom: -15,
        }}
      >
        <Avatar
          source={require("../assets/logos.png")}
          style={{ marginRight: 10 }}
        />
        <View
          style={{
            backgroundColor: "green",
            width: 20,
            height: 20,
            borderRadius: 10,
            marginLeft: -23,
            marginTop: 24,
            borderColor: "white",
            borderWidth: 3,
          }}
        ></View>
        <TextInput
          style={styles.input}
          placeholder="What do you think?"
          placeholderTextColor="#888"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: 300,
    fontSize: 14,
    fontWeight: "light",
    letterSpacing: 1,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 10,
    marginLeft: 14,
    backgroundColor: "white",
  },
});
export default Post;
