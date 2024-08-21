import React, { useState } from "react";
import { View, Text, Image } from "react-native";

const Register = () => {
  return (
    <View>
      <Image
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 50,
        }}
        width={100}
        height={100}
        source={{
          uri: "https://w7.pngwing.com/pngs/1008/900/png-transparent-facebook-fb-logo-social-social-media-social-media-logos-icon.png",
        }}
      ></Image>
      <Text>Register Screen</Text>
    </View>
  );
};

export default Register;
