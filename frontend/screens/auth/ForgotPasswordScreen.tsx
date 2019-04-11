import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Platform,
  ActivityIndicator
} from "react-native";

import { Styles } from "../../constants/Styles";
import { fetchAPI, API_URL } from "../../network/Backend";

if (Platform.OS === "android") {
  var headerMode: any = null;
}

export default class ForgotPasswordScreen extends React.Component<{
  navigation: any;
}> {
  static navigationOptions = {
    header: headerMode
  };

  state = {
    isLoading: false,
    email: "",
    password: "",
    error: "",
    status: 0,
    resetPressed: false
  };

  constructor(props: any) {
    super(props);
    this.resetPassword.bind(this);
  }

  resetPassword() {
    this.setState({ resetPressed: true });

    fetchAPI(
      `/sendPasswordResetLink?email=${this.state.email.trim()}&url=${API_URL}`
    ).then(async response => {
      if (response.status === 200) {
        alert("Emailed password reset link");
        this.setState({ resetPressed: false });
        this.props.navigation.navigate("Login");
      } else {
        var responseJson = await response.json();
        alert("Problems: " + responseJson.message);
        this.setState({ resetPressed: false });
      }
    });
  }
  render() {
    let showErr = this.state.error ? (
      <Text style={{ color: "red" }}>{this.state.error}</Text>
    ) : (
      <View />
    );

    return (
      <View>
        <View>
          <Text
            style={{
              fontSize: 35,
              textAlign: "center",
              fontWeight: "400",
              marginTop: 15
            }}
          >
            Ride Surfer
          </Text>
          <Text
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 25,
              fontStyle: "italic"
            }}
          >
            Forgot Password
          </Text>
          <Text style={{ textAlign: "center" }}>~No Problem~</Text>
        </View>
        <View style={{ marginTop: 30, marginLeft: 10, marginRight: 10 }}>
          <TextInput
            placeholder="Email"
            style={Styles.textInput}
            onChangeText={email => this.setState({ email: email.trim() })}
          />

          {this.state.resetPressed && <ActivityIndicator />}
          {!this.state.resetPressed && (
            <Button
              title="Reset Password"
              onPress={() => {
                this.resetPassword();
              }}
            />
          )}
        </View>
      </View>
    );
  }
}
