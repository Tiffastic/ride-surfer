import React from "react";
import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  View,
  Button,
  Platform
} from "react-native";

import { Styles, setDark } from "../../constants/Styles";

if (Platform.OS === "android") {
  var headerMode: any = null; // the default headerMode is undefined, and for iOS, undefined shows header
}

export default class SettingsScreen extends React.Component<{
  navigation: any;
}> {
  static navigationOptions = {
    header: headerMode
  };

  constructor(props: any) {
    super(props);
  }

  state: any = {};

  render() {
    return (
      <KeyboardAvoidingView
        style={Styles.container}
        behavior="padding"
        keyboardVerticalOffset={22}
        enabled
      >
        <ScrollView style={[Styles.wrapper, Styles.container]} />
        <Button
          title="Dark Mode"
          onPress={() => {
            this.setState({});
            setDark(true);
          }}
        />
        <Button
          title="Light Mode"
          onPress={() => {
            this.setState({});
            setDark(false);
          }}
        />
      </KeyboardAvoidingView>
    );
  }
}
