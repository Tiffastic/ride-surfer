import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  AsyncStorage
} from "react-native";

import Colors from "../constants/Colors";
import Styles from "../constants/Styles";

export default class LoginScreen extends React.Component<{ navigation: any }> {
  static navigationOptions = {
    header: null
  };

  state = {
    email: "",
    password: "",
    error: ""
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
    return fetch("http://ride-surfer.herokuapp.com/users/login/", {
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
      .then(response => response.json())

      .then(responseJson => {
        if (responseJson.message == "User Not Found") {
          this.setState({
            error: "User not found"
          });
        } else {
          this._saveUserAsync(responseJson).catch(console.log);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  private _saveUserAsync = async (userDetails: any) => {
    const jsonString = JSON.stringify(userDetails);
    await AsyncStorage.setItem("userDetails", jsonString);
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
