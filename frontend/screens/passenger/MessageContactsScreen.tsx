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
    this.sortMostRecentChats.bind(this);
    this.getMyRecentChats.bind(this);
    this.bootstrap.bind(this);

    this.bootstrap();
  }

  state: any = {
    isLoading: true,
    userId: "",
    userImage: "",
    recentPreviousChats: []
  };

  bootstrap = async () => {
    await this.getUserInfo(); // IMPORTANT, NEED userId first before we can move on
    await this.getMyRecentChats();
    await this.sortMostRecentChats();

    this.setState({ isLoading: false });
  };

  sortMostRecentChats = async () => {
    // sort the chats, make the highest chat date first in the array
    this.state.recentPreviousChats.sort(function(a: any, b: any) {
      return new Date(b.date) - new Date(a.date); // this works
    });

    // put the most recent chats from my chat partners in the dictionary
    // use set to make sure I sure only the most recent chat from my chat partner

    var dict: any = [];
    const partnersId = new Set();
    this.state.recentPreviousChats.map((chat: any) => {
      // make sure that only the most recent chats from my chat partners are stored
      if (!partnersId.has(chat.userId)) {
        partnersId.add(chat.userId);
        dict.push(chat);
      }
    });

    this.setState({ recentPreviousChats: dict });
  };

  getMyRecentChats = async () => {
    await fetchAPI("/getWhoISentMailTo?meId=" + this.state.userId)
      .then(response => response.json())
      .then(responseJson => {
        for (let key in responseJson.chatRecipients) {
          this.state.recentPreviousChats.push(responseJson.chatRecipients[key]);
        }
      })

      .catch(err => console.log(err));

    await fetchAPI("/getWhoSentMeMail?meId=" + this.state.userId)
      .then(response => response.json())
      .then(responseJson => {
        for (let key in responseJson.chatSenders) {
          this.state.recentPreviousChats.push(responseJson.chatSenders[key]);
        }
      })

      .catch(err => console.log(err));
  };

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
    /*
    AsyncStorage.getItem("userImage").then(item => {
      this.setState({ userPhoto: item });
    });
    */

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
    if (this.state.isLoading) {
      return <ActivityIndicator />;
    }

    // create an array of previous chat messages
    var myPreviousMessages: any = [];

    this.state.recentPreviousChats.map((chat: any) => {
      myPreviousMessages.push(
        <View key={chat.userId}>
          <PreviousMessage
            message={chat.chatMessage}
            recipientImage={chat.userImage}
            firstName={chat.firstName}
            lastName={chat.lastName}
            date={this.formatDate(new Date(chat.date))}
            recipientId={chat.userId}
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
              userImage: this.state.userImage
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
