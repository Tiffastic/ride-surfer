import React from "react";
import {
  TextInput,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  Platform,
  View,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert
} from "react-native";

import Colors from "../../constants/Colors";
import Styles from "../../constants/Styles";
import { fetchAPI } from "../../network/Backend";

import UserSession from "../../network/UserSession";
import { isLoaded } from "expo-font";

if (Platform.OS === "android") {
  var headerMode: any = null;
}

export default class SignupScreen extends React.Component<{ navigation: any }> {
  static navigationOptions = {
    header: headerMode
  };
  state = {
    isLoading: false,
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    car_make: null,
    car_model: null,
    car_year: null,
    car_plate: null,
    error: "",
    user_status: 0,
    vehicle_status: 0
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
            placeholder="License Plate"
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

          {this.state.isLoading ? (
            <View style={{ flex: 2 }}>
              <ActivityIndicator
                size="large"
                style={{
                  zIndex: 5,
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center"
                }}
              />
            </View>
          ) : (
            <Button
              color={Colors.primary}
              title="Sign Up"
              onPress={this._register}
            />
          )}
          {showErr}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  private _register = async () => {
    this.setState({ isLoading: true });

    return fetchAPI("/users", {
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
      .then(response => {
        //this is how to actual check status. you cannot after response.json()
        console.log("Server stat response: " + response.status);

        this.setState({
          user_status: response.status
        });
        return response.json();
      })
      .then(responseJson => {
        if (this.state.user_status === 400 || this.state.user_status === 500) {
          try {
            this.setState({
              error: responseJson.errors[0].message
            });
          } catch (err) {
            this.setState({
              error: "Something went very wrong"
            });
          }
          return;
        } else {
          fetchAPI("/vehicles", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              userId: responseJson.id,
              plate: this.state.car_plate,
              make: this.state.car_make,
              model: this.state.car_model,
              year: this.state.car_year
            })
          })
            .then(response => {
              //this is how to actual check status. you cannot after response.json()
              console.log("Server stat response: " + response.status);

              this.setState({
                vehicle_status: response.status
              });
              return response.json();
            })

            .then(vehicleJson => {
              if (
                this.state.vehicle_status === 400 ||
                this.state.vehicle_status === 500
              ) {
                try {
                  this.setState({
                    error: vehicleJson.errors[0].message
                  });
                } catch (err) {
                  this.setState({
                    error: "Something went very wrong cars"
                  });
                }
              } else {
                responseJson.vehicles = [vehicleJson];
                this._saveUserAsync(responseJson).catch(console.log);
              }
            })
            .catch(error => {
              console.log(error);
            });

          // create the user's bio
          fetchAPI("/createBio", {
            method: "POST",
            headers: {
              Accept: "appplicaton/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              userId: responseJson.id,
              ridesGiven: 0,
              ridesTaken: 0
            })
          }).catch(error => console.log(error));
        }
      })
      .catch(error => {
        console.log(error);
      })
      .then(() => this.setState({ isLoading: false }));
  };
  //Also if you want this to work, be sure each json field is correct, I.e. carYear should be a number..
  private _saveUserAsync = async (userDetails: any) => {
    await UserSession.set(userDetails);
    this.setState({ isLoading: false });
    Alert.alert("New account successfully created!");
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
