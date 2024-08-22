import React, { useState } from "react";
import { Text, Button, Image, View, TextInput, StyleSheet } from "react-native";
import KittenBTN from "../components/KittenBTN";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, gql } from "@apollo/client";
const MUTATION_REGISTER = gql`
  mutation Mutation($fields: RegisterField!) {
    register(fields: $fields)
  }
`;

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [funcRegister] = useMutation(MUTATION_REGISTER, {
    onCompleted: (response) => {
      setEmail("");
      setUsername("");
      setName("");
      setPassword("");
      navigation.navigate("Login");
    },
  });

  async function register() {
    try {
      await funcRegister({
        variables: {
          fields: {
            email,
            name,
            username,
            password,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Image
        width={300}
        height={180}
        style={{ borderRadius: 20 }}
        source={{
          uri: "https://cdn.dribbble.com/users/3960463/screenshots/14784031/media/5b635a8de5c2402e5f49692ed4c1b414.gif",
        }}
      ></Image>
      <Text
        style={{
          margin: 1,
          fontSize: 16,
          textAlign: "center",
          letterSpacing: 2,
          fontWeight: "500",
        }}
      >
        Create account for join with friends, family, dan community peoples.
      </Text>
      <View style={{ marginTop: 23 }}>
        <TextInput
          style={styles.input}
          placeholder="Your email address"
          value={email}
          onChangeText={(item) => setEmail(item)}
        ></TextInput>
        <TextInput
          style={styles.input}
          placeholder="Your full name"
          value={name}
          onChangeText={(item) => setName(item)}
        ></TextInput>
        <TextInput
          style={styles.input}
          placeholder="Your username"
          value={username}
          onChangeText={(item) => setUsername(item)}
        ></TextInput>
        <TextInput
          secureTextEntry
          style={styles.input}
          placeholder="Your password"
          value={password}
          onChangeText={(item) => setPassword(item)}
        ></TextInput>
        <View style={{ padding: 20 }}>
          <Button color="#007AFF" title="Register" onPress={register}></Button>
        </View>
        <View style={styles.kittenButtonContainer}>
          <KittenBTN
            screen="Login"
            text="Already have account? Register here"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: 300,
    fontSize: 14,
    fontWeight: "light",
    letterSpacing: 1,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "white",
  },
  buttonText: {
    color: "black",
    textAlign: "center",
    fontSize: 14,
  },
  kittenButtonContainer: {
    width: 300,
  },
});

export default Register;
