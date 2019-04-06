import React from "react";
import { Image, View, Text, StyleSheet } from "react-native";
import {
  Styles,
  addStylesListener,
  clearStylesListener
} from "../constants/Styles";

const defaultPic = require("../assets/images/default-profile.png");

export default function PreviousChat(props: {
  chatId: number;
  message: string;
  recipientImage: any;
  firstName: string;
  lastName: string;
  date: string;
  recipientId: number;
  recipientEmail: string;
  senderImage: any;
  messageColor: string;
}) {
  return (
    <View style={styles.messageButton}>
      <View style={styles.row}>
        <Image
          style={{ height: 50, width: 50, borderRadius: 50 }}
          source={
            props.recipientImage === null
              ? defaultPic
              : { uri: props.recipientImage }
          }
        />

        <View style={{ paddingLeft: 5 }}>
          <Text>
            <Text style={{ fontWeight: "bold" }}>
              {props.firstName + " " + props.lastName} {"  "}
            </Text>
            {props.date}
          </Text>

          <Text style={{ color: props.messageColor, fontStyle: "italic" }}>
            {props.message}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageButton: {
    margin: 12,
    borderBottomColor: "rgba(206, 206, 206, 1)",
    borderBottomWidth: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    padding: 10,
    paddingRight: 40,
    backgroundColor: "rgba(255, 255, 255, .8)"
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10
  }
});
