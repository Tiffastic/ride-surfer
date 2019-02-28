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

import Styles from "../../constants/Styles";

import UserSession from "../../network/UserSession";
import { fetchAPI } from "../../network/Backend";
import UserProfileScreen from "./ProfileScreen";

if (Platform.OS === "android") {
  var headerMode: any = null; // the default headerMode is undefined, and for iOS, undefined shows header
}

export default class UpdateProfileScreen extends React.Component<{
  navigation: any;
}> {
  static navigationOptions = {
    header: headerMode
  };

  constructor(props: any) {
    super(props);

    this._bootstrapAsync();
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

  _bootstrapAsync = async () => {
    let userDetails = await UserSession.get();
    if (userDetails == null) return;
    this.state.userId = userDetails.id;

    // get user previously stored information:
    fetchAPI("/users/" + this.state.userId)
      .then(response => response.json())
      .then(response => {
        this.state.first_name = response.firstName;
        this.state.last_name = response.lastName;
        this.state.email = response.email;
        this.state.vehicles = response.vehicles; // coming from the User model

        this.setState({ ...this.state });
      })
      .catch(error => console.log(error));
  };

  updateMyProfile() {
    // update user

    fetchAPI("/users/" + this.state.userId, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName: this.state.first_name,
        lastName: this.state.last_name,
        email: this.state.email
      })
    })
      .then(() => {
        // update each vehicle
        this.state.vehicles.forEach(async (car: any) => {
          await fetchAPI("/vehicles/" + car.id, {
            method: "PUT",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              make: car.make,
              model: car.model,
              year: car.year,
              plate: car.plate
            })
          });
        });
      })
      .then(() => {
        // set user object cache

        if (this.state.vehicles.length === 0) {
          UserSession.set({
            id: this.state.userId,
            firstName: this.state.first_name,
            lastName: this.state.last_name,
            email: this.state.email,
            vehicles: [{}]
          });
        } else {
          UserSession.set({
            id: this.state.userId,
            firstName: this.state.first_name,
            lastName: this.state.last_name,
            email: this.state.email,
            vehicles: [
              {
                carPlate: this.state.vehicles[0].plate,
                carMake: this.state.vehicles[0].make,
                carModel: this.state.vehicles[0].model,
                carYear: this.state.vehicles[0].year
              }
            ]
          });

          this.props.navigation.push("HomeScreen");
          this.props.navigation.push("ProfileScreen"); // twice is necessary for ProfileScreen to rerender upon returning to it.
        }
      });
  }

  render() {
    var vehiclesInfo = [];

    if (this.state.vehicles !== undefined) {
      for (let i = 0; i < this.state.vehicles.length; i++) {
        vehiclesInfo.push(
          <View style={{ paddingBottom: 10 }}>
            <Text>Vehicle {i + 1}</Text>

            <TextInput
              style={Styles.textInput}
              placeholder={
                this.state.vehicles[i].make === null
                  ? ""
                  : this.state.vehicles[i].make
              }
              onChangeText={data => (this.state.vehicles[i].make = data)}
            />

            <TextInput
              style={Styles.textInput}
              placeholder={
                this.state.vehicles[i].model === null
                  ? ""
                  : this.state.vehicles[i].model
              }
              onChangeText={data => (this.state.vehicles[i].model = data)}
            />

            <TextInput
              style={Styles.textInput}
              placeholder={
                this.state.vehicles[i].year === null
                  ? ""
                  : this.state.vehicles[i].year.toString()
              }
              onChangeText={data =>
                (this.state.vehicles[i].year = Number(data))
              }
            />

            <TextInput
              style={Styles.textInput}
              placeholder={
                this.state.vehicles[i].plate === null
                  ? ""
                  : this.state.vehicles[i].plate
              }
              onChangeText={data => (this.state.vehicles[i].plate = data)}
            />
          </View>
        );
      }
    }

    return (
      <KeyboardAvoidingView
        style={Styles.container}
        behavior="padding"
        keyboardVerticalOffset={22}
        enabled
      >
        <ScrollView style={[Styles.wrapper, Styles.container]}>
          <Text style={Styles.paragraphText}>Update Profile</Text>

          <TextInput
            style={Styles.textInput}
            placeholder={this.state.first_name}
            onChangeText={data => (this.state.first_name = data)}
          />

          <TextInput
            style={Styles.textInput}
            placeholder={this.state.last_name}
            onChangeText={data => (this.state.last_name = data)}
          />

          <TextInput
            style={Styles.textInput}
            placeholder={this.state.email}
            onChangeText={data => (this.state.email = data)}
          />

          <View style={{ marginTop: 20 }}>{vehiclesInfo}</View>

          <Text>We need a Plus Sign to add more vehicles</Text>

          <Button title="Update" onPress={this.updateMyProfile.bind(this)} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
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
