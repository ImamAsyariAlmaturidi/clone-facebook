import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button as KittenButton } from "@ui-kitten/components";

const KittenBTN = ({ text }) => {
  return (
    <View>
      <KittenButton style={styles.kittenButton} appearance="outline">
        <Text style={styles.buttonText}>{text}</Text>
      </KittenButton>
    </View>
  );
};

const styles = StyleSheet.create({
  kittenButton: {
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "black",
    textAlign: "center",
    fontSize: 14,
  },
});

export default KittenBTN;
