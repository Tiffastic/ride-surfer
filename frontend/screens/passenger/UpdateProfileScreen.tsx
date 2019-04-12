import React from "react";
import {
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  View,
  Button,
  Platform,
  ActivityIndicator
} from "react-native";

import { Styles } from "../../constants/Styles";

import UserSession from "../../network/UserSession";
import { fetchAPI } from "../../network/Backend";
import { timingSafeEqual } from "crypto";
import { userInfo } from "os";

import { NavigationActions, StackActions } from "react-navigation";

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

    // this._bootstrapAsync();
  }

  state: any = {
    first_name: "",
    last_name: "",
    email: "",
    newPassword: "",
    currentPassword: "",
    userId: 0,
    vehicles: [],
    home: "",
    work: "", // an array of vehicles queried from the User model

    current_first_name: "",
    current_last_name: "",
    current_email: "",
    current_vehicles: [],

    userInfoUpdateSuccess: false,
    vehicleUpdateSuccess: false
  };

  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    let userDetails = await UserSession.get();
    if (userDetails == null) return;

    await this.setState({ userId: userDetails.id });

    // get user previously stored information:
    await fetchAPI("/users/" + this.state.userId)
      .then(async response => {
        if (response.status === 200) {
          // was able to retrieve user's information
          var responseJson = await response.json();

          // set state to user's information
          this.setState({
            current_first_name: responseJson.firstName,
            current_last_name: responseJson.lastName,
            current_email: responseJson.email,
            current_vehicles: responseJson.vehicles,

            first_name: responseJson.firstName,
            last_name: responseJson.lastName,
            email: responseJson.email,
            home: responseJson.home,
            work: responseJson.work
          });

          // cannot give this.state.vehicles = responseJson.vehicles,
          //because then this.state.current_vehicles and this.state.vehicles would point to the SAME ARRAY
          await fetchAPI(`/getUserVehicles?userId=${this.state.userId}`)
            .then(async responseVehicles => {
              if (responseVehicles.status === 200) {
                var responseVehiclesJson = await responseVehicles.json();

                this.setState({ vehicles: responseVehiclesJson.vehicles });
              }
            })
            .catch(err =>
              alert("System trouble: cannot retrieve vehicle info")
            );
        }
      })
      .catch(error => alert("System trouble: Cannot retrieve user info"));
  };

  changeUserSession = async () => {
    await UserSession.set({
      id: this.state.userId,
      firstName: this.state.first_name.trim(),
      lastName: this.state.last_name.trim(),
      email: this.state.email.trim(),
      home: this.state.home,
      work: this.state.work,
      vehicles: [
        {
          plate:
            this.state.vehicles[0].plate !== null
              ? this.state.vehicles[0].plate.trim()
              : null,
          make:
            this.state.vehicles[0].make !== null
              ? this.state.vehicles[0].make.trim()
              : null,

          model:
            this.state.vehicles[0].model !== null
              ? this.state.vehicles[0].model.trim()
              : null,
          year: this.state.vehicles[0].year
        }
      ]
    });
  };

  changeUserInfoAndVehicle = async () => {
    console.log("THIS.STATE.VEHICLES = ", this.state.vehicles);
    console.log("this.state.first_name = ", this.state.first_name);
    console.log("this.state.last_name = ", this.state.last_name);
    console.log("this.state.email = ", this.state.email);
    console.log("this.state.current password = ", this.state.currentPassword);
    console.log("this.state.newPassword = ", this.state.newPassword);
    var userInfoUpdateSuccess = false;
    var vehicleUpdateSuccess = false;
    // update User profile
    await fetchAPI("/users/" + this.state.userId, {
      method: "PUT",

      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        firstName: this.state.first_name.trim(),
        lastName: this.state.last_name.trim(),
        email: this.state.email.trim(),
        password:
          this.state.newPassword === ""
            ? this.state.currentPassword
            : this.state.newPassword
      })
    })
      .then(async response => {
        if (response.status === 200) {
          userInfoUpdateSuccess = true;
        } else {
          var responseJson = await response.json();

          if (responseJson.errors[0].message === "email must be unique") {
            alert("Email already taken by another user, try another email");
          } else {
            alert("Cannot update user info, check fields (ex: new password).");
          }
        }
      })
      .catch(error => {
        console.log(error);
        alert("System trouble: cannot update profile. Try again.");
      });

    var car = this.state.vehicles[0];

    await fetchAPI("/vehicles/" + car.id, {
      method: "PUT",

      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        make: car.make == null ? null : car.make.trim(),
        model: car.model == null ? null : car.model.trim(),
        year: car.year,
        plate: car.plate == null ? null : car.plate.trim()
      })
    })
      .then(response => {
        if (response.status === 200) {
          vehicleUpdateSuccess = true;
        } else {
          alert("Vehicle cannot be updated, check fields");
        }
      })
      .catch(error => {
        alert("System error: Cannot update vehicle");
      });

    this.setState({
      userInfoUpdateSuccess: userInfoUpdateSuccess,
      vehicleUpdateSuccess: vehicleUpdateSuccess
    });
  };

  revertBackToOldUserInfo = async () => {
    /***************************************/

    // revert back to old user's info
    await fetchAPI("/users/" + this.state.userId, {
      method: "PUT",

      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        firstName: this.state.current_first_name,
        lastName: this.state.current_last_name,
        email: this.state.current_email,
        password: this.state.currentPassword
      })
    })
      .then(response => {
        if (response.status !== 200) {
          alert("Old user information cannot be put back, check profile page");
        }
      })
      .catch(error => {
        console.log(error);
        alert("System trouble: cannot store old user information back");
      });
    /***************************************/

    // REVERT BACK TO OLD VEHICLE
    await fetchAPI("/vehicles/" + this.state.current_vehicles[0].id, {
      method: "PUT",

      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        make: this.state.current_vehicles[0].make,
        model: this.state.current_vehicles[0].model,
        year: this.state.current_vehicles[0].year,
        plate: this.state.current_vehicles[0].plate
      })
    })
      .then(response => {
        if (response.status !== 200) {
          alert("Vehicle cannot be updated, check fields");
        }
      })
      .catch(error => {
        alert("System error: Cannot update vehicle");
      });
  };

  navigateBackToProfileScreen() {
    // reset the stack:  https://stackoverflow.com/questions/50781080/navigationactions-reset-is-not-a-function
    const resetAction = StackActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: "HomeScreen" })]
    });
    this.props.navigation.dispatch(resetAction);

    //this.props.navigation.push("ProfileScreen");
  }
  updateMyProfile = async () => {
    this.setState({ updateProfilePressed: true });

    //  verify current password in order to make any changes to the User's Profile
    await fetchAPI(
      `/verifyUserPassword?userId=${this.state.userId}&password=${
        this.state.currentPassword
      }`
    )
      .then(async response => {
        if (response.status === 200) {
          // verified user's current password

          await this.changeUserInfoAndVehicle();

          if (
            // has successfully changed user info and/or vehicle
            this.state.userInfoUpdateSuccess &&
            this.state.vehicleUpdateSuccess
          ) {
            // SUCCESSFULLY UPDATED BOTH USER INFO AND VEHICLE INFO

            var changeUserSessionPromise = this.changeUserSession();

            Promise.all([changeUserSessionPromise]).then(() => {
              this.navigateBackToProfileScreen();
            });
          } else {
            // CANNOT UPDATE USER'S INFO AND/OR VEHICLE, REVERT BACK TO USER'S OLD INFO AND OLD VEHICLE
            this.revertBackToOldUserInfo();
          }
        } else {
          // CURRENT PASSWORD NOT CORRECT
          alert("Cannot update profile, check current password.");
        }
      })
      .catch(error => {
        console.log(error);
        alert("System trouble: Cannot update profile. Try again.");
      });

    this.setState({
      updateProfilePressed: false
    });
  };

  render() {
    var vehiclesInfo = [];

    if (this.state.current_vehicles !== undefined) {
      for (let i = 0; i < this.state.current_vehicles.length; i++) {
        vehiclesInfo.push(
          <View key={i.toString()} style={{ paddingBottom: 10 }}>
            <Text key={"car" + i}>Surf Mobile</Text>

            <TextInput
              key={"carmake" + i}
              style={[Styles.textInput, { color: "green" }]}
              placeholder={
                this.state.current_vehicles[i].make === null
                  ? "Make"
                  : this.state.current_vehicles[0].make
              }
              onChangeText={data => {
                if (data === "") {
                  this.state.vehicles[i].make = this.state.current_vehicles[
                    i
                  ].make;
                } else {
                  this.state.vehicles[i].make = data;
                }

                this.setState({
                  vehicles: this.state.vehicles
                });
              }}
            />

            <TextInput
              key={"carmodel" + i}
              style={[Styles.textInput, { color: "green" }]}
              placeholder={
                this.state.current_vehicles[i].model === null
                  ? "Model"
                  : this.state.current_vehicles[i].model
              }
              onChangeText={data => {
                if (data === "") {
                  this.state.vehicles[i].model = this.state.current_vehicles[
                    i
                  ].model;
                } else {
                  this.state.vehicles[i].model = data;
                }

                this.setState({
                  vehicles: this.state.vehicles
                });
              }}
            />

            <TextInput
              key={"caryear" + i}
              style={[Styles.textInput, { color: "green" }]}
              placeholder={
                this.state.current_vehicles[i].year === null
                  ? "Year"
                  : this.state.current_vehicles[i].year.toString()
              }
              onChangeText={data => {
                if (data === "") {
                  this.state.vehicles[i].year = this.state.current_vehicles[
                    i
                  ].year;
                } else {
                  this.state.vehicles[i].year = Number(data.trim());
                }

                this.setState({
                  vehicles: this.state.vehicles
                });
              }}
            />

            <TextInput
              key={"plate" + i}
              style={[Styles.textInput, { color: "green" }]}
              placeholder={
                this.state.current_vehicles[i].plate == null
                  ? "License Plate"
                  : this.state.current_vehicles[i].plate
              }
              onChangeText={data => {
                if (data === "") {
                  this.state.vehicles[i].plate = this.state.current_vehicles[
                    i
                  ].plate;
                } else {
                  this.state.vehicles[i].plate = data;
                }

                this.setState({ vehicles: this.state.vehicles });
              }}
            />
          </View>
        );
      }
    }

    //var firstName = this.state.first_name;

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
            style={[Styles.textInput, { color: "green" }]}
            placeholder={this.state.current_first_name}
            onChangeText={data => {
              if (data === "") {
                this.setState({ first_name: this.state.current_first_name });
              } else {
                this.setState({
                  first_name: data
                });
              }
            }}
          />

          <TextInput
            style={[Styles.textInput, { color: "green" }]}
            placeholder={this.state.current_last_name}
            onChangeText={data => {
              if (data === "") {
                this.setState({ last_name: this.state.current_last_name });
              } else {
                this.setState({ last_name: data });
              }
            }}
          />

          <TextInput
            autoCapitalize="none"
            style={[Styles.textInput, { color: "green" }]}
            placeholder={this.state.current_email}
            onChangeText={data => {
              if (data === "") {
                this.setState({ email: this.state.current_email });
              } else {
                this.setState({ email: data });
              }
            }}
          />

          <TextInput
            autoCapitalize="none"
            style={[Styles.textInput, { color: "green" }]}
            placeholder={"New Password"}
            secureTextEntry={true}
            onChangeText={data =>
              this.setState({
                newPassword: data
              })
            }
          />

          <TextInput
            autoCapitalize="none"
            style={[Styles.textInput, { color: "rgb(230, 19, 87)" }]}
            placeholder={"*Current password - Necessary"}
            secureTextEntry={true}
            onChangeText={data =>
              this.setState({
                currentPassword: data,
                startedEditing_CurrentPassword: true
              })
            }
          />

          <View style={{ marginTop: 20 }}>{vehiclesInfo}</View>

          {this.state.updateProfilePressed && <ActivityIndicator />}
          {!this.state.updateProfilePressed && (
            <Button title="Update" onPress={this.updateMyProfile.bind(this)} />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
