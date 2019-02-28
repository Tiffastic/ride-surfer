import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Platform
} from "react-native";

import Colors from "../../constants/Colors";
import Styles from "../../constants/Styles";
import { fetchAPI } from "../../network/Backend";
import UserSession from "../../network/UserSession";

if (Platform.OS === "android") {
  var headerMode: any = null;
}

export default class LoginScreen extends React.Component<{ navigation: any }> {
  static navigationOptions = {
    header: headerMode
  };
  state = {
    email: "",
    password: "",
    error: "",
    status: 0
  };

  render() {
    let showErr = this.state.error ? (
      <Text style={{ color: "red" }}>{this.state.error}</Text>
    ) : (
      <View />
    );
    return (
      <ScrollView style={[Styles.wrapper, Styles.container]}>
        <View>
          <Text style={Styles.titleText}>Ride Surfer</Text>

          <Text style={{ fontSize: 16 }}>Please Log In to Continue </Text>
        </View>

        <View style={styles.loginContainer}>
          <View>
            <Text style={Styles.infoText}>Email:</Text>
            <TextInput
              placeholder="Email"
              style={Styles.textInput}
              onChangeText={email => this.setState({ email })}
            />
          </View>

          <View>
            <Text style={Styles.infoText}>Password: </Text>
            <TextInput
              placeholder="Password"
              style={Styles.textInput}
              onChangeText={password => this.setState({ password })}
              secureTextEntry={true}
            />
          </View>
        </View>

        <View style={Styles.buttonView}>
          <Button color={Colors.primary} title="Login" onPress={this._logIn} />
        </View>

        {showErr}
      </ScrollView>
    );
  }

  private _logIn = async () => {
    return fetchAPI("/users/login/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(response => {
        //this is how to actual check status. you cannot after response.json()
        this.setState({
          status: response.status
        });
        return response.json();
      })
      .then(responseJson => {
        if (this.state.status === 404) {
          this.setState({
            error: responseJson.message
          });
        } else {
          //this func also will take you to the home screen
          this._saveUserAsync(responseJson).catch(console.log);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  private _saveUserAsync = async (userDetails: any) => {
    await UserSession.set(userDetails);
    this.props.navigation.navigate("Main");
  };
}

const styles = StyleSheet.create({
  loginContainer: {
    paddingTop: 15,
    paddingBottom: 10,
    flex: 1
  }
});
