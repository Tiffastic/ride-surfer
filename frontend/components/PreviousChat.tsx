import React from "react";
import {
  Image,
  View,
  Text,
  TouchableHighlight,
  StyleSheet
} from "react-native";
import {
  Styles,
  addStylesListener,
  clearStylesListener
} from "../constants/Styles";

const defaultPic = require("../assets/images/default-profile.png");

function continueChat(
  navigation: any,
  id: number,
  firstName: string,
  lastName: string,
  recipientImage: any,
  email: string,
  senderImage: any,
  chatId: number
) {
  navigation.navigate("MessageConversations", {
    recipientId: id,
    recipientFirstName: firstName,
    recipientLastName: lastName,
    recipientImage: recipientImage,
    recipientEmail: email,
    userImage: senderImage,
    chatId: chatId
  });
}

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
  navigation: any;
}) {
  return (
    <TouchableHighlight
      style={styles.messageButton}
      underlayColor="orange"
      onPress={() => {
        continueChat(
          props.navigation,
          props.recipientId,
          props.firstName,
          props.lastName,
          props.recipientImage,
          props.recipientEmail,
          props.senderImage,
          props.chatId
        );
      }}
    >
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
            {props.firstName + " " + props.lastName} {"  "}
            {props.date}
          </Text>

          <Text>{props.message}</Text>
        </View>
      </View>
    </TouchableHighlight>
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
