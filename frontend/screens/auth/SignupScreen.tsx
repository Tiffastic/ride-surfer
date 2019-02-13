import React from "react";
import {
  TextInput,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  AsyncStorage,
  View,
  KeyboardAvoidingView
} from "react-native";

import Colors from "../../constants/Colors";
import Styles from "../../constants/Styles";
import { fetchAPI } from "../../network/Backend";

import UserSession from "../../network/UserSession";

export default class SignupScreen extends React.Component<{ navigation: any }> {
  static navigationOptions = {
    header: null
  };

  state = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    car_make: "",
    car_model: "",
    car_year: "",
    car_plate: "",
    error: ""
  };

  render() {
    let showErr = this.state.error ? (
      <Text style={{ color: "red" }}>{this.state.error}</Text>
    ) : (
      <View />
    );
    return (
      <KeyboardAvoidingView
        style={Styles.container}
        behavior="padding"
        keyboardVerticalOffset={22}
        enabled
      >
        <ScrollView style={[Styles.wrapper, Styles.container]}>
          <Text style={Styles.titleText}>Ride Surfer</Text>

          <Text style={Styles.paragraphText}>Create an Account</Text>

          <TextInput
            style={Styles.textInput}
            placeholder="First Name"
            onChangeText={data => this.setState({ first_name: data })}
          />

          <TextInput
            style={Styles.textInput}
            placeholder="Last Name"
            onChangeText={data => this.setState({ last_name: data })}
          />

          <TextInput
            style={Styles.textInput}
            placeholder="Email"
            onChangeText={data => this.setState({ email: data })}
          />

          <TextInput
            style={Styles.textInput}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={data => this.setState({ password: data })}
          />

          <TextInput
            style={Styles.textInput}
            placeholder="Licence Plate"
            onChangeText={data => this.setState({ car_plate: data })}
          />

          <TextInput
            style={Styles.textInput}
            placeholder="Car Make"
            onChangeText={data => this.setState({ car_make: data })}
          />

          <TextInput
            style={Styles.textInput}
            placeholder="Car Model"
            onChangeText={data => this.setState({ car_model: data })}
          />

          <TextInput
            style={Styles.textInput}
            placeholder="Car Year"
            onChangeText={data => this.setState({ car_year: data })}
          />

          <Button
            color={Colors.primary}
            title="Sign Up"
            onPress={this._register}
          />
          {showErr}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  private _register = async () => {
    return fetchAPI("/users/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName: this.state.first_name,
        lastName: this.state.last_name,
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(response => response.json())

      .then(userJson => {
        if (userJson.status == 400) {
          this.setState({
            error: userJson.error
          });
        } else {
          fetchAPI("/vehicles/", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              userId: userJson.id,
              plate: this.state.car_plate,
              make: this.state.car_make,
              model: this.state.car_model,
              year: this.state.car_year
            })
          })
            .then(response => response.json())

            .then(vehicleJson => {
              if (vehicleJson.status == 400) {
                this.setState({
                  error: vehicleJson.error
                });
              } else {
                userJson.vehicles = [vehicleJson];
                this._saveUserAsync(userJson).catch(console.log);
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  //Also if you want this to work, be sure each json field is correct, I.e. carYear should be a number..
  private _saveUserAsync = async (userDetails: any) => {
    await UserSession.set(userDetails);
    this.props.navigation.navigate("Main");
  };
}

const styles = StyleSheet.create({
  textInput: {
    borderColor: "#c3c3c3",
    backgroundColor: "white",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    fontSize: 36
  }
});
