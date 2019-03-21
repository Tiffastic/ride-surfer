import React from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableHighlight,
  Button
} from "react-native";
import Colors from "../../constants/Colors";

import { fetchAPI } from "../../network/Backend";
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

  state = {};

  render() {
    return (
      <View style={styles.container}>
        <Text> Message Details</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  flatview: {
    justifyContent: "center",
    paddingTop: 5,
    borderRadius: 2,
    flexDirection: "row",
    margin: 5
  },
  searchResultsList: {
    marginTop: 10,
    marginBottom: 10
  },
  searchResultsItem: {
    borderColor: "#c3c3c3",
    borderBottomWidth: 1
  }
});
