import React from "react";
import { View, Text, Image } from "react-native";
import { Avatar } from "@ui-kitten/components";
const CardPost = () => {
  return (
    <View
      style={{
        flex: 1,
        marginTop: 20,
      }}
    >
      {/* Loop Disini*/}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          padding: 26,
          borderTopWidth: 1,
          borderColor: "gray",
          marginBottom: 10,
        }}
      >
        <Avatar
          source={require("../assets/logos.png")}
          style={{ marginRight: 10 }}
        />
        <Text style={{ fontWeight: "bold" }}>Dylan - Tired Programming</Text>
      </View>
      <View
        style={{
          display: "flex",
        }}
      >
        <Text style={{ paddingLeft: 50 }}>
          I'm tired cause using php language fvck!
        </Text>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            width={200}
            height={200}
            source={{
              uri: "https://preview.redd.it/i612fp8mytv21.jpg?width=640&crop=smart&auto=webp&s=d1d93f65c961a0e3629fc4ea48975109f923988f",
            }}
          ></Image>
        </View>
        <View
          style={{
            marginTop: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <View>
            <Text>Likes</Text>
          </View>
          <View>
            <Text>Comment</Text>
          </View>
          <View>
            <Text>Share</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          padding: 26,
          marginVertical: 30,
          borderTopWidth: 1,
          borderColor: "gray",
          marginBottom: 10,
        }}
      >
        <Avatar
          source={require("../assets/logos.png")}
          style={{ marginRight: 10 }}
        />
        <Text style={{ fontWeight: "bold" }}>Dylan - Tired Programming</Text>
      </View>
      <View
        style={{
          display: "flex",
        }}
      >
        <Text style={{ paddingLeft: 50 }}>
          I'm tired cause using php language fvck!
        </Text>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            width={200}
            height={200}
            source={{
              uri: "https://preview.redd.it/i612fp8mytv21.jpg?width=640&crop=smart&auto=webp&s=d1d93f65c961a0e3629fc4ea48975109f923988f",
            }}
          ></Image>
        </View>
        <View
          style={{
            marginTop: 10,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <View>
            <Text>Likes</Text>
          </View>
          <View>
            <Text>Comment</Text>
          </View>
          <View>
            <Text>Share</Text>
          </View>
        </View>
      </View>
      {/* Loop Disini*/}
    </View>
  );
};

export default CardPost;
