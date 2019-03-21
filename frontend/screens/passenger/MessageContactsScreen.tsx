import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  FlatList,
  Button,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { Location } from "expo";
import Colors from "../../constants/Colors";
import { fetchAPI } from "../../network/Backend";
import UserSession from "../../network/UserSession";

const defaultPic = require("../../assets/images/default-profile.png");

export default class MessageContactsScreen extends React.Component<{
  navigation: any;
}> {
  static navigationOptions = {
    title: "Messages"
  };
  constructor(props: any) {
    super(props);
  }

  state: any = {
    isLoading: false
  };
  render() {
    if (this.state.isLoading) {
      return <ActivityIndicator />;
    }
    return (
      <View style={styles.container}>
        <Text>Messages</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(255, 255, 255)"
  },

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
  },

  imageHolder: {
    marginLeft: 10
  },

  name: {
    fontSize: 33
  },

  searchResultsList: {
    marginTop: 10,
    marginBottom: 10
  }
});
