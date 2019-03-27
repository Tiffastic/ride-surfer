import React from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";

import ChatMessage from "../../components/ChatMessage";

const io = require("socket.io-client");

import UserSession from "../../network/UserSession";
import { fetchAPI, API_URL } from "../../network/Backend";
const defaultPic = require("../../assets/images/default-profile.png");

export default class MessageConversationsScreen extends React.Component<{
  navigation: any;
}> {
  static navigationOptions = {
    title: "Message Details"
  };

  constructor(props: any) {
    super(props);
    this.bootstrap();
  }

  state: any = {
    userId: null,
    textMessage: "",
    recentMessages: [],
    socket: null,
    userImage: null, // the sender's image
    senderIsTyping: false
  };

  getUserDetails = async () => {
    let userDetails = await UserSession.get();
    if (userDetails == null) return;

    this.setState({ userId: userDetails.id });
  };

  getUserPhoto = async () => {
    this.setState({ userImage: this.props.navigation.getParam("userImage") });
  };

  getOurMostRecentChats = async () => {
    // retrieve recent chats from you and me saved in the database

    fetchAPI(
      `/getOurChatSessionConversations?meId=${
        this.state.userId
      }&youId=${this.props.navigation.getParam("recipientId")}`
    )
      .then(response => response.json())
      .then(responseJson => {
        var chats = responseJson.ourChats;

        var chatMessages: any = [];

        chats.forEach((item: any) => {
          chatMessages.push(
            <ChatMessage
              message={item.message}
              image={
                item.userIdSender === this.state.userId
                  ? this.state.userImage
                  : this.props.navigation.getParam("recipientImage")
              }
              role={
                item.userIdSender === this.state.userId ? "sender" : "recipient"
              }
            />
          );
        });

        this.setState({ recentMessages: chatMessages });
      });
  };

  bootstrap = async () => {
    await this.getUserDetails();
    await this.getUserPhoto();

    await this.getOurMostRecentChats();
  };

  emitIsTypingMessage(textMessage: string) {
    this.state.socket.emit("typing", {
      userIdRecipient: this.props.navigation.getParam("recipientId"),
      senderIsTyping: textMessage !== "" ? true : false
    });
  }
  submitChatMessage() {
    // after the user submits a chat message, tell the websocket and then save the chat in the database.

    if (this.state.socket !== null && this.state.textMessage !== "") {
      var myMessage = this.state.textMessage;

      // sending "chat" signal to websocket, thus announcing to websocket that we've sent a message
      this.state.socket.emit("chat", {
        userIdSender: this.state.userId,
        senderImage: this.state.userImage,
        userIdRecipient: this.props.navigation.getParam("recipientId"),
        message: myMessage
      });

      // add our recent chat to the list of chats viewable on the screen
      this.setState({
        recentMessages: [
          ...this.state.recentMessages,
          <ChatMessage
            message={this.state.textMessage}
            image={this.state.userImage}
            role="sender"
          />
        ],

        textMessage: ""
      });

      // store message into database

      fetchAPI("/saveChatSessionMessage", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chatId: this.props.navigation.getParam("chatId"),
          message: myMessage,
          senderId: this.state.userId,
          youId: this.props.navigation.getParam("recipientId")
        })
      }).catch(error => console.log(error)); // TO DO: should tell the user that their chat didn't send
    }
  }

  componentDidMount() {
    // connecting to websocket -- look in bin/www
    this.state.socket = io(API_URL);

    if (this.state.socket !== null) {
      // listening for websocket to emit "chat" signal  -- look in bin/wwww
      this.state.socket.on("chat", (msgInfo: any) => {
        // we've received a chat message from some phone
        if (msgInfo.userIdRecipient === this.state.userId) {
          // if we are the recipient of this message, then display this message to us
          // this may not be the most secure way, but it works for now
          this.setState({
            recentMessages: [
              ...this.state.recentMessages,
              <ChatMessage
                message={msgInfo.message}
                image={msgInfo.senderImage}
                role="recipient"
              />
            ],
            senderIsTyping: false
          });
        }
      });

      this.state.socket.on("typing", (msgInfo: any) => {
        if (msgInfo.userIdRecipient === this.state.userId) {
          this.setState({ senderIsTyping: msgInfo.senderIsTyping });
        }
      });
    }
  }
  render() {
    //console.log(this.props.navigation.getParam("recipientImage"));
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          keyboardVerticalOffset={100}
          behavior="padding"
          enabled
        >
          <View style={{ alignItems: "center" }}>
            <Image
              style={{ height: 150, width: 150, borderRadius: 75 }}
              resizeMode="center"
              source={
                this.props.navigation.getParam("recipientImage") !== null
                  ? {
                      uri: this.props.navigation.getParam("recipientImage")
                    }
                  : defaultPic
              }
            />

            <Text>
              {this.props.navigation.getParam("recipientFirstName")}{" "}
              {this.props.navigation.getParam("recipientLastName")}{" "}
            </Text>

            <Text>{this.props.navigation.getParam("recipientEmail")} </Text>
            {this.state.senderIsTyping ? (
              <Text style={{ color: "purple" }}>...is typing</Text>
            ) : (
              <Text />
            )}
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {this.state.recentMessages.map((msgInfo: any, i: number) => (
              <View key={i}>{msgInfo}</View>
            ))}
          </ScrollView>

          <TextInput
            style={{ padding: 15 }}
            placeholder="Message..."
            value={this.state.textMessage}
            onChangeText={textMessage => {
              this.setState({ textMessage });

              // emit out signal that person is typing
              this.emitIsTypingMessage(textMessage);
            }}
            onSubmitEditing={() => {
              this.submitChatMessage();
            }}
          />

          <Button
            title="Send"
            onPress={() => {
              this.submitChatMessage();
            }}
          />
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
