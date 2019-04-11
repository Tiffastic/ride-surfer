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
import { Styles } from "../../constants/Styles";
import { fetchAPI } from "../../network/Backend";

import UserSession from "../../network/UserSession";
import { isLoaded } from "expo-font";

import { registerForPushNotifications } from "../../network/PushNotificationRegister";

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
      <ScrollView style={[Styles.wrapper, Styles.container]}>
        <Text style={Styles.titleText}>Ride Surfer</Text>

        <Text style={Styles.paragraphText}>Create an Account</Text>

        <TextInput
          style={Styles.textInput}
          placeholder="First Name*"
          autoFocus={true}
          returnKeyType="done"
          onChangeText={data => this.setState({ first_name: data })}
          onEndEditing={() => {}}
        />

        <TextInput
          style={Styles.textInput}
          placeholder="Last Name*"
          returnKeyType="done"
          onChangeText={data => this.setState({ last_name: data })}
        />

        <TextInput
          style={Styles.textInput}
          placeholder="Email*"
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="done"
          onChangeText={data => this.setState({ email: data })}
        />

        <TextInput
          style={Styles.textInput}
          placeholder="Password*"
          returnKeyType="done"
          secureTextEntry={true}
          onChangeText={data => this.setState({ password: data })}
        />
        <Button
          color={Colors.primary}
          title="Add Car Details"
          onPress={this._goToSignupDriver}
        />
        <View style={Styles.textInput} />

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
        firstName: this.state.first_name.trim(),
        lastName: this.state.last_name.trim(),
        email: this.state.email.trim(),
        password: this.state.password.trim()
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
                return this._saveUserAsync(responseJson)
                  .then(() => {
                    // register user for Push Notifications
                    registerForPushNotifications();
                  })
                  .catch(console.log);
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
    Alert.alert("New account successfully created!");
    this.props.navigation.navigate("Main");
  };

  //Navs to driver deets, using a "callback" to set this classes state upon child class nav.goBack
  //made possible with returnData and a bind?
  private _goToSignupDriver = () => {
    this.props.navigation.navigate("SignupDriver", {
      returnData: this.returnData.bind(this)
    });
  };

  private returnData(make: any, model: any, year: any, plate: any) {
    this.setState({
      car_make: make,
      car_model: model,
      car_year: year,
      car_plate: plate
    });
  }
}
