import React, { useEffect } from "react";
import { View } from "react-native";
import Comments from "../components/Comments";
import { SafeAreaView } from "react-native-safe-area-context";
const Detail = ({ route, navigation }) => {
  const { postId } = route.params;
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "white",
        width: "100%",
        height: "100%",
      }}
    >
      <Comments postId={postId} />
    </View>
  );
};

export default Detail;
