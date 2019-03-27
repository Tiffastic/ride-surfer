import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  ActivityIndicator
} from "react-native";

import { fetchAPI } from "../../network/Backend";
import UserSession from "../../network/UserSession";

import PreviousMessage from "../../components/PreviousChat";

export default class MessageContactsScreen extends React.Component<{
  navigation: any;
}> {
  static navigationOptions = {
    title: "Messages"
  };
  constructor(props: any) {
    super(props);
    this.getUserInfo.bind(this);

    this.getMyRecentChatSessions.bind(this);
    this.bootstrap.bind(this);

    this.bootstrap();
  }

  state: any = {
    isLoading_GetMyRecentChatSessions: true,
    userId: "",
    userImage: "",
    recentPreviousChats: []
  };

  bootstrap = async () => {
    await this.getUserInfo(); // IMPORTANT, NEED userId first before we can move on
    // this.getMyRecentChats();
    this.getMyRecentChatSessions();
  };

  getMyRecentChatSessions() {
    fetchAPI("/getLatestChatSessionMessages?meId=" + this.state.userId)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          recentPreviousChats: responseJson.myRecentChats.reverse(),
          isLoading_GetMyRecentChatSessions: false
        });
      });
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
  getUserInfo = async () => {
    // when User logs in, their image is stored in Async Storage

    let userDetails = await UserSession.get();
    if (userDetails == null) return;

    this.setState({ userId: userDetails.id });

    await fetchAPI("/getUserImage/" + this.state.userId)
      .then(response => response.json())
      .then(response => {
        this.setState({ userImage: response.userImage });
      })
      .catch(error => {
        console.log("ERROR GET USER Photo = ", error);
      });
  };

  render() {
    if (this.state.isLoading_GetMyRecentChatSessions) {
      return <ActivityIndicator />;
    }

    // create an array of previous chat messages
    var myPreviousMessages: any = [];

    this.state.recentPreviousChats.map((chat: any) => {
      myPreviousMessages.push(
        <View key={chat.userId}>
          <PreviousMessage
            chatId={chat.chatId}
            message={chat.chatMessage}
            recipientImage={chat.userImage}
            firstName={chat.firstName}
            lastName={chat.lastName}
            date={this.formatDate(new Date(chat.date))}
            recipientId={chat.partnerId}
            recipientEmail={chat.email}
            senderImage={this.state.userImage}
            navigation={this.props.navigation}
          />
        </View>
      );
    });

    return (
      <View style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <Text>My Surf Messages</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {myPreviousMessages}
        </ScrollView>

        <Button
          title="New Chat"
          onPress={() => {
            this.props.navigation.navigate("MessageNewChatSearch", {
              userImage: this.state.userImage,
              senderId: this.state.userId
            });
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(255, 255, 255)"
  }
});
