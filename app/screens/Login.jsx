import React from 'react';
import { View, Image, StyleSheet, TextInput, Button as RNButton, Text } from 'react-native';
import KittenBTN from '../components/KittenBTN';
import { SafeAreaView } from "react-native-safe-area-context";
const Login = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{
            uri: 'https://w7.pngwing.com/pngs/561/460/png-transparent-fb-facebook-facebook-logo-social-media-icon-thumbnail.png',
          }}
        />
      </View>
      <View >
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
        />
      </View>
      <View style={{ width: 300, borderRadius: 300}}>
        <RNButton

          color="#007AFF"
          title="Login"
          onPress={() => alert('Login Pressed')}
        />
      </View>
      <View style={styles.kittenButtonContainer}>
        <KittenBTN  screen="Register" text="Create new account"/>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontWeight: 'light',
    letterSpacing: 1,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  kittenButtonContainer: {
    marginTop: 140,
    width: 300,
  },
});
export default Login;
