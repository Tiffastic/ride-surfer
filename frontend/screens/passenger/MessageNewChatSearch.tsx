import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity
} from "react-native";

import { fetchAPI } from "../../network/Backend";

export default class MessageContactsScreen extends React.Component<{
  navigation: any;
}> {
  static navigationOptions = {
    title: "New Chat Search"
  };
  constructor(props: any) {
    super(props);
    this.submitChatMessage.bind(this);
  }

  state: any = {
    isLoading: false,
    recipientEmail: "",
    status: 0,
    error: "",
    recipientImage: "",
    pressedSearch: false
  };

  submitChatMessage() {
    fetchAPI(
      `/getChatSessionInfo?email=${
        this.state.recipientEmail
      }&meId=${this.props.navigation.getParam("senderId")}`
    )
      .then(async response => {
        let responseJson = await response.json();
        if (response.status === 200) {
          this.props.navigation.navigate("MessageConversations", {
            recipientId: responseJson.recipientId,
            recipientFirstName: responseJson.recipientFirstName,
            recipientLastName: responseJson.recipientLastName,
            recipientImage: responseJson.recipientImage,
            recipientEmail: this.state.recipientEmail,
            chatId: responseJson.chatId,
            userImage: this.props.navigation.getParam("userImage")
          });

          this.setState({ recipientEmail: "" });
        } else {
          this.setState({ error: responseJson.message, pressedSearch: false });
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({ error: error, pressedSearch: false });
      });
  }

  render() {
    let showErr = this.state.error ? (
      <Text style={{ color: "red" }}>{this.state.error}</Text>
    ) : (
      <View />
    );

    let showSearch = this.state.pressedSearch ? (
      <ActivityIndicator />
    ) : (
      <Button
        title="Start New Chat"
        onPress={() => {
          // get picture and recipient's user id from backend
          // pass that info to MessageConversationsScreen
          this.setState({ pressedSearch: true }, () => {
            this.submitChatMessage();
          });
        }}
      />
    );

    if (this.state.isLoading) {
      return <ActivityIndicator />;
    }
    return (
      <KeyboardAvoidingView
        style={styles.container}
        keyboardVerticalOffset={100}
        behavior="padding"
        enabled
      >
        <View style={{ alignContent: "center" }}>
          {showErr}

          <TextInput
            style={{ alignSelf: "center" }}
            value={this.state.recipientEmail}
            placeholder="RideSurfer@Email.com"
            onSubmitEditing={() => {
              this.submitChatMessage();
            }}
            onChangeText={
              typed => this.setState({ recipientEmail: typed.trim() }) // trim the email so that there is no trailing white space
            }
          />

          {showSearch}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(255, 255, 255)",
    justifyContent: "center",
    alignItems: "center"
  }
});
