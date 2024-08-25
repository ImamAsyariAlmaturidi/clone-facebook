import React, { useContext, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TextInput,
  Button as RNButton,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, gql, useLazyQuery } from "@apollo/client";
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

const GET_PROFILE = gql`
  query GetProfile {
    getProfile {
      _id
      name
      username
      email
      followers {
        _id
        name
        username
        email
      }
      followings {
        _id
        name
        username
        email
      }
    }
  }
`;

const Login = ({ navigation }) => {
  const { setIsLogin } = useContext(authContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [funcGetProfile, { loading: profileLoading }] =
    useLazyQuery(GET_PROFILE);
  const [funcLogin, { loading: loginLoading, error: loginError }] =
    useMutation(LOGIN_MUTATION);

  const handleLogin = async () => {
    try {
      const { data } = await funcLogin({
        variables: {
          fields: {
            email,
            password,
          },
        },
      });

      await AsyncStorage.setItem("access_token", data.login.access_token);

      const profileResponse = await funcGetProfile();

      setIsLogin(true);
      navigation.navigate("MainStack");
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
      <View style={styles.buttonContainer}>
        <RNButton
          color="#007AFF"
          title={loginLoading ? "Logging in..." : "Login"}
          onPress={handleLogin}
          disabled={loginLoading}
        />
      </View>

      <View style={styles.buttonContainer}>
        <KittenBTN text="Create new account?" screen="Register" />
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
  buttonContainer: {
    width: 300,
    borderRadius: 10,
    marginTop: 20,
  },
});

export default Login;
