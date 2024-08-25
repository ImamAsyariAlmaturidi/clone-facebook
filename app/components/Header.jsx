import React, { useContext } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { authContext } from "../context/authContext";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SearchBar } from "react-native-elements";
const Header = () => {
  const navigation = useNavigation();
  const { setIsLogin } = useContext(authContext);
  async function logout() {
    try {
      await AsyncStorage.clear();

      setIsLogin(false);
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <View>
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
          <Ionicons
            name="person"
            size={25}
            onPress={() => {
              navigation.navigate("MyProfile");
            }}
          />
          <Ionicons name="log-out" size={25} onPress={logout} />
        </View>
      </View>
      <View style={{ marginHorizontal: 25 }}>
        <SearchBar
          round="true"
          onPress={() => {
            navigation.navigate("Search");
          }}
          lightTheme="true"
          containerStyle={{
            backgroundColor: "white",
            borderTopWidth: "0",
            borderBottomWidth: "0",
          }}
          inputContainerStyle={{
            backgroundColor: "#e0e0e0",
          }}
          placeholder="Search"
        ></SearchBar>
      </View>
    </View>
  );
};

export default Header;
