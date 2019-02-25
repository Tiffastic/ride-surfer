import React from "react";
import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  View,
  Button
} from "react-native";

import Styles from "../../constants/Styles";

import UserSession from "../../network/UserSession";
import { fetchAPI } from "../../network/Backend";
import UserProfileScreen from "./ProfileScreen";

export default class UpdateProfileScreen extends React.Component<{
  navigation: any;
}> {
  static navigationOptions = {
    header: null
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
    vehicles: []
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
        this.state.vehicles = response.vehicles;

        this.setState({ ...this.state });
      })
      .catch(error => console.log(error));
  };

  refreshFunction() {
    this.forceUpdate();
  }
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
        // update vehicles
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

        if (this.state.vehicles.length == 0) {
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
        }
      })
      .then(() => {
        this.props.navigation.navigate("ProfileScreen");
      }); // profile screen does not update unless you log out.
  }

  render() {
    var vehiclesInfo = [];

    for (let i = 0; i < this.state.vehicles.length; i++) {
      vehiclesInfo.push(
        <View style={{ paddingBottom: 10 }}>
          <Text>Vehicle {i + 1}</Text>

          <TextInput
            style={Styles.textInput}
            placeholder={this.state.vehicles[i].make}
            onChangeText={data => (this.state.vehicles[i].make = data)}
          />

          <TextInput
            style={Styles.textInput}
            placeholder={this.state.vehicles[i].model}
            onChangeText={data => (this.state.vehicles[i].model = data)}
          />

          <TextInput
            style={Styles.textInput}
            placeholder={this.state.vehicles[i].year.toString()}
            onChangeText={data => (this.state.vehicles[i].year = Number(data))}
          />

          <TextInput
            style={Styles.textInput}
            placeholder={this.state.vehicles[i].plate}
            onChangeText={data => (this.state.vehicles[i].plate = data)}
          />
        </View>
      );
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
