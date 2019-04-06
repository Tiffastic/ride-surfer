import React from "react";
import { Image, View, Text } from "react-native";
const defaultPic = require("../assets/images/default-profile.png");

export default function ChatMessage(props: {
  message: string;
  image: any;
  role: string;
  date: string;
  showDate: boolean;
}) {
  return (
    <View style={{ paddingTop: 30 }}>
      <View style={{ margin: 0, paddingBottom: 5, alignItems: "center" }}>
        {props.showDate && (
          <Text style={{ color: "rgb(46, 78, 103)" }}>{props.date}</Text>
        )}
      </View>
      <View
        style={{
          alignItems: props.role === "sender" ? "flex-end" : "flex-start",
          paddingLeft: 20,
          paddingRight: 20
        }}
      >
        <Image
          style={{ height: 50, width: 50, borderRadius: 50 }}
          source={props.image === null ? defaultPic : { uri: props.image }}
        />

        <Text
          style={{
            color: props.role === "sender" ? "rgb(208, 85, 88)" : "green"
          }}
        >
          {props.message}
        </Text>
      </View>
    </View>
  );
}
