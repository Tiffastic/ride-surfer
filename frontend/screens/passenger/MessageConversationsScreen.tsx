import React from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
import Colors from "../../constants/Colors";
import { Styles } from "../../constants/Styles";

import ChatMessage from "../../components/ChatMessage";

// web socket to communicate with server and server can send out signals to other phones
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
  }

  state: any = {
    userId: null,
    textMessage: "",
    recentMessages: [],
    socket: null,
    userImage: null, // the sender's image
    senderIsTyping: false,
    isLoadingConversations: true,

    currentChatDate: "",

    keyboardAppeared: false,
    keyboardDisappeared: true,
    chatMessageNum: 0
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
        var messageDate = "";

        chats.map((item: any, i: number) => {
          chatMessages.push(
            <ChatMessage
              key={i.toString()}
              message={item.message}
              image={
                item.userIdSender === this.state.userId
                  ? this.state.userImage
                  : this.props.navigation.getParam("recipientImage")
              }
              role={
                item.userIdSender === this.state.userId ? "sender" : "recipient"
              }
              date={this.formatDate(new Date(item.date))}
              showDate={
                messageDate === ""
                  ? true
                  : this.formatDate(new Date(messageDate)) !==
                    this.formatDate(new Date(item.date))
              }
            />
          );

          if (messageDate === "") {
            messageDate = item.date;
          } else if (
            this.formatDate(new Date(messageDate)) !==
            this.formatDate(new Date(item.date))
          ) {
            messageDate = item.date;
          }
        });

        this.setState({
          recentMessages: chatMessages,
          currentChatDate: this.formatDate(new Date(messageDate)),
          chatMessageNum: chatMessages.length
        });
      });
  };

  // IMPORTANT: assuming that input string is a formatted date string
  currentDateChanged(messageDate: string) {
    if (this.state.currentChatDate !== messageDate) {
      this.setState({
        currentChatDate: messageDate
      });
      return true;
    } else {
      return false;
    }
  }

  formatDate(chatDate: Date) {
    var monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];

    return (
      monthNames[chatDate.getMonth()] +
      " " +
      chatDate.getDate() +
      ", " +
      chatDate.getFullYear()
    );
  }

  bootstrap = async () => {
    await this.getUserDetails();

    await this.getUserPhoto();

    await this.getOurMostRecentChats();

    // connecting to websocket -- look in bin/www
    this.state.socket = io(API_URL);
    this.state.socket.emit("login", { userId: this.state.userId });
    this.setState({ isLoadingConversations: false });
  };

  emitIsTypingMessage(textMessage: string) {
    this.state.socket.emit("typing", {
      userIdSender: this.state.userId,
      userIdRecipient: this.props.navigation.getParam("recipientId"),
      senderIsTyping: textMessage !== "" ? true : false
    });
  }
  submitChatMessage() {
    // after the user submits a chat message, tell the websocket and then save the chat in the database.

    if (this.state.socket !== null && this.state.textMessage !== "") {
      var myMessage = this.state.textMessage;
      var today = new Date();
      var todayFormatDate = this.formatDate(today);

      // sending "chat" signal to websocket, thus announcing to websocket that we've sent a message

      this.state.socket.emit("chat", {
        userIdSender: this.state.userId,
        // senderImage: this.state.userImage,
        userIdRecipient: this.props.navigation.getParam("recipientId"),
        message: myMessage,
        date: todayFormatDate
      });

      this.state.socket.emit("recipientPresence", {
        userIdSender: this.state.userId,
        userIdRecipient: this.props.navigation.getParam("recipientId"),
        message: myMessage
      });
      // add our recent chat to the list of chats viewable on the screen

      var messageNum = this.state.chatMessageNum + 1;
      this.setState({
        recentMessages: [
          ...this.state.recentMessages,
          <ChatMessage
            key={messageNum.toString()}
            message={this.state.textMessage}
            image={this.state.userImage}
            role="sender"
            date={todayFormatDate}
            showDate={this.currentDateChanged(todayFormatDate)}
          />
        ],

        textMessage: "",
        chatMessageNum: messageNum
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

  componentWillUnmount() {
    // this works
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({ keyboardAppeared: true, keyboardDisappeared: false });
  };

  _keyboardDidHide = () => {
    this.setState({ keyboardAppeared: false, keyboardDisappeared: true });
  };

  componentDidMount() {
    //https://facebook.github.io/react-native/docs/keyboard
    //keyboard events
    this.bootstrap();

    // this works
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );

    // this works
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );

    // connecting to websocket -- look in bin/www

    this.state.socket = io(API_URL);

    if (this.state.socket !== null) {
      this.state.socket.emit("login", { userId: this.state.userId });
      // listening for websocket to emit "chat" signal  -- look in bin/wwww
      this.state.socket.on("chat", (msgInfo: any) => {
        // we've received a chat message from someone, but it has to be the person we are currently chatting with in order to show up on our screen
        if (
          msgInfo.userIdRecipient === this.state.userId &&
          msgInfo.userIdSender === this.props.navigation.getParam("recipientId")
        ) {
          var formatMsgDate = this.formatDate(new Date(msgInfo.date));
          // if we are the recipient of this message, then display this message to us
          // this may not be the most secure way, but it works for now
          var messageNum = this.state.chatMessageNum + 1;
          this.setState({
            recentMessages: [
              ...this.state.recentMessages,
              <ChatMessage
                key={messageNum.toString()}
                message={msgInfo.message}
                // image={msgInfo.senderImage}
                image={this.props.navigation.getParam("recipientImage")}
                role="recipient"
                date={formatMsgDate}
                showDate={this.currentDateChanged(formatMsgDate)}
              />
            ],
            senderIsTyping: false,
            chatMessageNum: messageNum
          });
        }
      });

      this.state.socket.on("typing", (msgInfo: any) => {
        if (
          msgInfo.userIdRecipient === this.state.userId &&
          msgInfo.userIdSender === this.props.navigation.getParam("recipientId")
        ) {
          this.setState({ senderIsTyping: msgInfo.senderIsTyping });
        }
      });

      this.state.socket.on("recipientPresence", (msgInfo: any) => {
        // if I am the sender of the chat message
        if (msgInfo.senderId === this.state.userId) {
          // check to see if my recipient is online
          if (!msgInfo.recipientOnline) {
            // send push notification to offline recipient
            //Send a push notification offline recipient
            fetchAPI(
              `/pushNotificationMessage?userId=${msgInfo.recipientId}&message=${
                msgInfo.pushNotification
              }`
            );
          }
        }
      });
    }
  }

  // allow sender to view recipient's profile page
  private viewProfile = () => {
    var userId = this.props.navigation.getParam("recipientId");
    fetchAPI("/getUserVehicles?userId=" + userId)
      .then(response => response.json())
      .then(responseJson => {
        this.props.navigation.push("GenericProfile", {
          user: {
            id: userId,
            firstName: this.props.navigation.getParam("recipientFirstName"),
            lastName: this.props.navigation.getParam("recipientLastName"),
            vehicles: responseJson.vehicles
          }
        });
      });
  };

  render() {
    if (this.state.isLoadingConversations) {
      return <ActivityIndicator />;
    }

    // scroll to bottom of messages
    // https://stackoverflow.com/questions/29310553/is-it-possible-to-keep-a-scrollview-scrolled-to-the-bottom

    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          keyboardVerticalOffset={100}
          behavior="padding"
          enabled
        >
          <View>
            <TouchableHighlight onPress={this.viewProfile}>
              <View style={{ alignItems: "center" }}>
                <Image
                  style={{ height: 150, width: 150, borderRadius: 150 }}
                  source={
                    this.props.navigation.getParam("recipientImage") !== null
                      ? {
                          uri: this.props.navigation.getParam("recipientImage")
                        }
                      : defaultPic
                  }
                />

                <Text style={{ color: "blue" }}>
                  {this.props.navigation.getParam("recipientFirstName")}{" "}
                  {this.props.navigation.getParam("recipientLastName")}{" "}
                </Text>
              </View>
            </TouchableHighlight>
          </View>

          {this.state.senderIsTyping ? (
            <Text style={{ color: "purple", textAlign: "center" }}>
              ...is typing
            </Text>
          ) : (
            <Text />
          )}

          {this.state.keyboardAppeared && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              ref={ref => (this.scrollView = ref)}
              onContentSizeChange={(contentWidth, contentHeight) => {
                this.scrollView.scrollToEnd({ animated: false });
              }}
            >
              {this.state.recentMessages}
            </ScrollView>
          )}

          {this.state.keyboardDisappeared && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              ref={ref => (this.scrollView = ref)}
              onContentSizeChange={(contentWidth, contentHeight) => {
                this.scrollView.scrollToEnd({ animated: false });
              }}
            >
              {this.state.recentMessages}
            </ScrollView>
          )}

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
            color="rgb(36, 167, 217)"
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
