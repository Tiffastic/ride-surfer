import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableHighlight
} from "react-native";
import { Location } from "expo";
import {
  Styles,
  addStylesListener,
  clearStylesListener
} from "../../constants/Styles";
import { fetchAPI } from "../../network/Backend";
import UserSession from "../../network/UserSession";

import PreviousMessage from "../../components/PreviousChat";
import PreviousChatSession from "../../components/PreviousChatSession";

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
  }

  state: any = {
    isLoading_GetMyRecentChatSessions: true,
    userId: "",
    userImage: "",
    recentPreviousChats: []
  };

  componentWillMount() {
    addStylesListener(this.onStylesChange);
  }

  componentWillUnmount() {
    clearStylesListener(this.onStylesChange);
  }

  private onStylesChange = () => this.forceUpdate();

  componentDidMount() {
    this.bootstrap();
  }

  bootstrap = async () => {
    await this.getUserInfo(); // IMPORTANT, NEED userId first before we can move on

    this.getMyRecentChatSessions();
  };

  getMyRecentChatSessions() {
    //fetchAPI("/getLatestChatSessionMessages?meId=" + this.state.userId)
    fetchAPI("/getLatestChatSessionMessagesRawQuery?meId=" + this.state.userId)
      .then(response => response.json())
      .then(responseJson => {
        /*
        responseJson.myRecentChats.sort((a: any, b: any) => {
          return new Date(b.date) - new Date(a.date);
        });
        */
        this.setState({
          recentPreviousChats: responseJson.myRecentChats, // show latest message first
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

    fetchAPI("/getUserImage/" + this.state.userId)
      .then(response => response.json())
      .then(response => {
        this.setState({ userImage: response.userImage });
      })
      .catch(error => {
        console.log("ERROR GET USER Photo = ", error);
      });
  };

  continueChat(
    id: number,
    firstName: string,
    lastName: string,
    recipientImage: any,
    email: string,
    senderImage: any,
    chatId: number
  ) {
    this.props.navigation.navigate("MessageConversations", {
      recipientId: id,
      recipientFirstName: firstName,
      recipientLastName: lastName,
      recipientImage: recipientImage,
      recipientEmail: email,
      userImage: senderImage,
      chatId: chatId
    });
  }

  render() {
    return (
      <View style={Styles.container}>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 15,
              fontStyle: "italic",
              fontWeight: "bold",
              color: "rgb(36, 167, 217)" //"rgb(39, 177, 211)" //"rgb(41, 181, 216)"
            }}
          >
            My Surf Messages
          </Text>
        </View>

        {this.state.isLoading_GetMyRecentChatSessions && <ActivityIndicator />}

        {!this.state.isLoading_GetMyRecentChatSessions && (
          <FlatList
            style={{}}
            data={this.state.recentPreviousChats}
            extraData={this.state}
            renderItem={({ item }: any) => (
              <TouchableHighlight
                underlayColor="rgb(30, 203, 234)"
                onPress={() => {
                  this.continueChat(
                    item.partnerId,
                    item.firstName,
                    item.lastName,
                    item.userImage,
                    item.email,
                    this.state.userImage,
                    item.chatId
                  );
                }}
              >
                <PreviousChatSession
                  chatId={item.chatId}
                  message={item.chatMessage}
                  recipientImage={item.userImage}
                  firstName={item.firstName}
                  lastName={item.lastName}
                  date={this.formatDate(new Date(item.date))}
                  recipientId={item.partnerId}
                  recipientEmail={item.email}
                  senderImage={this.state.userImage}
                  messageColor={
                    item.senderId == this.state.userId
                      ? "rgb(208, 85, 88)"
                      : "green"
                  }
                />
              </TouchableHighlight>
            )}
          />
        )}

        <View style={{ marginLeft: 10, marginRight: 10 }}>
          <Button
            title="New Surf Chat"
            color="rgb(36, 167, 217)" //"rgb(39, 177, 211)" //"rgb(41, 181, 216)"
            onPress={() => {
              this.props.navigation.navigate("MessageNewChatSearch", {
                userImage: this.state.userImage,
                senderId: this.state.userId
              });
            }}
          />
        </View>
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
