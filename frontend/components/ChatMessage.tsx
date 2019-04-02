import React from "react";
import { Image, View, Text } from "react-native";
const defaultPic = require("../assets/images/default-profile.png");

export default function ChatMessage(props: {
  message: string;
  image: any;
  role: string;
  date: string;
  dateHasChanged: boolean;
}) {
  return (
    <View style={{ paddingTop: 30 }}>
      <View style={{ margin: 0, paddingBottom: 5, alignItems: "center" }}>
        {props.dateHasChanged && <Text>{props.date}</Text>}
      </View>
      <View
        style={{
          alignItems: props.role === "sender" ? "flex-start" : "flex-end",
          paddingLeft: 20,
          paddingRight: 20
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
    </View>
  );
}
