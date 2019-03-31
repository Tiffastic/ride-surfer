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

  state: any = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    car_make: "",
    car_model: "",
    car_year: "",
    car_plate: "",
    error: "",
    userId: 0,
    vehicles: [] // an array of vehicles queried from the User model
  };

  updateMyProfile() {
    // update user
    setDark(true);
    console.log("setDark ran i guess...");
    this.state.error = "fluf";
  }

  render() {
    return (
      <KeyboardAvoidingView
        style={Styles.container}
        behavior="padding"
        keyboardVerticalOffset={22}
        enabled
      >
        <ScrollView style={[Styles.wrapper, Styles.container]}>
          <Button
            title="Update"
            onPress={() => this.props.navigation.push("MessageContacts")}
          />
        </ScrollView>
        <Button
          title="Dark Mode"
          onPress={() => {
            this.setState({});
            setDark(true);
          }}
        />
        <Button
          title="fart Mode"
          onPress={() => {
            this.setState({});
            setDark(false);
          }}
        />
      </KeyboardAvoidingView>
    );
  }
}
