import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button as KittenButton } from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";
const KittenBTN = ({ text, screen }) => {
  const navigation = useNavigation();
  return (
    <View>
      <KittenButton
        onPress={() => {
          navigation.navigate(screen);
        }}
        style={styles.kittenButton}
        appearance="outline"
      >
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
