import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableHighlight,
  StyleSheet,
  ListRenderItemInfo,
  ActivityIndicator,
  Image,
  Dimensions
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
    recipientImage: ""
  };

  submitChatMessage() {
    fetchAPI("/getChatRecipientInfo?email=" + this.state.recipientEmail)
      .then(response => {
        this.state.status = response.status;
        return response.json();
      })
      .then(responseJson => {
        if (this.state.status === 200) {
          this.props.navigation.navigate("MessageConversations", {
            recipientId: responseJson.recipientId,
            recipientFirstName: responseJson.recipientFirstName,
            recipientLastName: responseJson.recipientLastName,
            recipientImage: responseJson.recipientImage,
            recipientEmail: this.state.recipientEmail,
            userImage: this.props.navigation.getParam("userImage")
          });

          this.setState({ recipientEmail: "" });
        } else {
          this.setState({ error: responseJson.message });
        }
      })

      .catch(error => {
        console.log(error);
      });
  }
  render() {
    let showErr = this.state.error ? (
      <Text style={{ color: "red" }}>{this.state.error}</Text>
    ) : (
      <View />
    );

    if (this.state.isLoading) {
      return <ActivityIndicator />;
    }
    return (
      <View style={styles.container}>
        {showErr}
        <TextInput
          value={this.state.recipientEmail}
          placeholder="RideSurfer@Email.com"
          onSubmitEditing={() => {
            this.submitChatMessage();
          }}
          onChangeText={typed => this.setState({ recipientEmail: typed })}
        />

        <Button
          title="Start New Chat"
          onPress={() => {
            // get picture and recipient's user id from backend
            // pass that info to MessageConversationsScreen
            this.submitChatMessage();
          }}
        />
      </View>
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
