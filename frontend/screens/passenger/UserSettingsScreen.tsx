import React from "react";
import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  View,
  Button,
  Platform,
  ColorPropType
} from "react-native";

import { Styles, setDark } from "../../constants/Styles";
import { registerForPushNotifications } from "../../network/PushNotificationRegister";

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
        <Text style={{ marginLeft: 16, marginTop: 16, fontSize: 20 }}>
          My Settings
        </Text>
        <ScrollView style={[Styles.wrapper, Styles.container]} />

        <View style={{ marginRight: 15, marginLeft: 15 }}>
          <View style={{ marginBottom: 15 }}>
            <Button
              title="Reset Push Notification"
              onPress={() => registerForPushNotifications()}
              color="rgb(63, 197, 116)"
            />
          </View>

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
        </View>
      </KeyboardAvoidingView>
    );
  }
}
