import React from "react";
import { Image, View, Text } from "react-native";
const defaultPic = require("../assets/images/default-profile.png");

export default function ChatMessage(props: {
  message: string;
  image: any;
  role: string;
}) {
  return (
    <View
      style={{
        alignItems: props.role === "sender" ? "flex-start" : "flex-end",
        padding: 15
      }}
    >
      <Image
        style={{ height: 50, width: 50, borderRadius: 50 }}
        source={props.image === null ? defaultPic : { uri: props.image }}
      />
      <Text style={{ color: props.role === "sender" ? "blue" : "green" }}>
        {props.message}
      </Text>
    </View>
  );
}
