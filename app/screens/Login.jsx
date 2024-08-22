import React, { useCallback, useContext, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  Button as RNButton,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, gql } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import KittenBTN from "../components/KittenBTN";
import { authContext } from "../context/authContext";
const LOGIN_MUTATION = gql`
  mutation Login($fields: LoginField) {
    login(fields: $fields) {
      access_token
      message
    }
  }
`;

const Login = ({ navigation }) => {
  const { setIsLogin } = useContext(authContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [funcLogin] = useMutation(LOGIN_MUTATION, {
    onCompleted: async (response) => {
      try {
        await AsyncStorage.setItem("access_token", response.login.access_token);
        setIsLogin(true);
        navigation.navigate("MainStack");
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleLogin = async () => {
    try {
      await funcLogin({
        variables: {
          fields: {
            email,
            password,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{
            uri: "https://w7.pngwing.com/pngs/561/460/png-transparent-fb-facebook-facebook-logo-social-media-icon-thumbnail.png",
          }}
        />
      </View>
      <View>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <View style={{ width: 300, borderRadius: 300 }}>
        <RNButton color="#007AFF" title="Login" onPress={handleLogin} />
      </View>

      <View style={{ width: 300, borderRadius: 300, marginTop: 60 }}>
        <KittenBTN text="Create new account?" screen="Register"></KittenBTN>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  imageContainer: {
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  input: {
    width: 300,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    backgroundColor: "white",
  },
});

export default Login;
