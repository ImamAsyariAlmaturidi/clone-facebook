import React, { useState } from "react";
import { Text, Button, Image, View, TextInput, StyleSheet } from "react-native";
import KittenBTN from "../components/KittenBTN";
import { SafeAreaView } from "react-native-safe-area-context";
const Login = () => {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center"}}>
      <Image width={300} height={200} style={{borderRadius: 20}} source={{ uri: "https://cdn.dribbble.com/users/3960463/screenshots/14784031/media/5b635a8de5c2402e5f49692ed4c1b414.gif"}}></Image>
      <Text style={{ margin: 2, fontSize: 16, textAlign:"center", justifyContent: "center", letterSpacing: 2, fontWeight: "500"}}> Create account for join with friends, family, dan community peoples.</Text>
        <SafeAreaView>
        <TextInput style={styles.input} placeholder="Your email address"></TextInput>
        <TextInput style={styles.input} placeholder="Your full name"></TextInput>
        <TextInput style={styles.input} placeholder="Your username"></TextInput>
        <TextInput secureTextEntry style={styles.input} placeholder="Your password"></TextInput>
        <View style={{ padding: 20}}>
          <Button color="#007AFF" title="Register"></Button>
        </View>
      <View style={styles.kittenButtonContainer}>
      <KittenBTN text="Already have account? Login here"/>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 300,
    fontSize: 14,
    fontWeight: 'light',
    letterSpacing: 1,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 14,
  },
  kittenButtonContainer: {
    width: 300,
  },
});



export default Login;
