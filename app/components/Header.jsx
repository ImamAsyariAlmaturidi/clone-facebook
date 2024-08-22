import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
const Header = () => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
      }}
    >
      <Text
        style={{
          fontSize: 30,
          color: "blue",
          fontWeight: "bold",
          letterSpacing: 1,
          padding: 16,
        }}
      >
        Facebook
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          padding: 20,
          marginTop: 5,
          justifyContent: "space-between",
          width: 140,
        }}
      >
        <Ionicons name="person" size={25} />
        <Ionicons name="log-out" size={25} />
      </View>
    </View>
  );
};

export default Header;
