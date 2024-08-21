import React from "react";
import { View } from "react-native";
const Home = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "red", width: 4000, height: 100 }}>
      <View style={{ flex: 1, backgroundColor: "white" }}></View>
      <View style={{ flex: 4, backgroundColor: "yellow" }}></View>
    </View>
  );
};

export default Home;
