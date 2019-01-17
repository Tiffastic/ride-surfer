import React from "react";
import { Image, StyleSheet, View } from "react-native";

const picMessageBubble = require("../../assets/images/MessageBubble5.png");

export default class MessageConversationsScreen extends React.Component<{
  navigation: any;
}> {
  static navigationOptions = {
    title: "Conversations"
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <Image source={picMessageBubble} />
      </View>
    );
  }

  _handlePress = () => {
    this.props.navigation.popToTop();
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(51, 170, 234)"
  }
});
