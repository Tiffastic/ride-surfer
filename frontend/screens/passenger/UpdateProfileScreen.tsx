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
    updateProfilePressed: false,
    startedEditing_FirstName: false,
    startedEditing_LastName: false,
    startedEditing_Email: false,
    startedEditing_CarMake: false,
    startedEditing_CarModel: false,
    startedEditing_CarYear: false,
    startedEditing_CarPlate: false,
    startedEditing_CurrentPassword: false,
    startedEditing_NewPassword: false
  };

  componentDidMount() {
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    let userDetails = await UserSession.get();
    if (userDetails == null) return;

    this.setState({ userId: userDetails.id });

    // get user previously stored information:
    await fetchAPI("/users/" + this.state.userId)
      .then(response => response.json())
      .then(response => {
        this.state.first_name = response.firstName;
        this.state.last_name = response.lastName;
        this.state.email = response.email;
        this.state.vehicles = response.vehicles; // coming from the User model
        this.state.home = response.home;
        this.state.work = response.work;

        this.setState({ ...this.state });
      })
      .catch(error => console.log(error));
  };

  updateMyProfile() {
    //  verify current password in order to make any changes to the User's Profile
    fetchAPI(
      `/verifyUserPassword?userId=${this.state.userId}&password=${
        this.state.currentPassword
      }`
    )
      .then(response => {
        if (response.status === 200) {
          fetchAPI("/users/" + this.state.userId, {
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
              if (response.status == 200) {
                // update each vehicle

                this.state.vehicles.forEach(async (car: any) => {
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
                      plate: car.year == null ? null : car.plate.trim()
                    })
                  }).then(async response => {
                    if (response.status == 200) {
                      // UserSession.clear();
                      this.setState({ updateProfilePressed: true });

                      // set user object cache
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
                      }).then(() => {
                        this.setState({
                          updateProfilePressed: false
                        });

                        this.props.navigation.push("HomeScreen");
                        // twice is necessary for ProfileScreen to rerender upon returning to it.
                        this.props.navigation.push("ProfileScreen");
                      });
                    } else {
                      alert("Cannot update vehicle");
                    }
                  });
                });
              } else {
                alert(
                  "Cannot update user information Possible problems with input. (ex: new password, user info, etc.)"
                );
                return;
              }
            })
            .catch(error => {
              console.log(error);
              alert("System trouble: cannot update profile. Try again.");
            });
        } else {
          alert("Cannot update profile, check current password.");
        }
      })
      .catch(error => {
        console.log(error);
        alert("System trouble: Cannot update profile. Try again.");
      });
  }

  render() {
    var vehiclesInfo = [];

    if (this.state.vehicles !== undefined) {
      for (let i = 0; i < this.state.vehicles.length; i++) {
        vehiclesInfo.push(
          <View key={i.toString()} style={{ paddingBottom: 10 }}>
            <Text key={"car" + i}>Surf Mobile</Text>

            <TextInput
              key={"carmake" + i}
              style={[Styles.textInput, { color: "green" }]}
              placeholder={
                this.state.startedEditing_CarMake
                  ? "Make"
                  : this.state.vehicles[i].make == null
                  ? "Make"
                  : this.state.vehicles[i].make
              }
              onChangeText={data => {
                this.state.vehicles[i].make = data;
                this.setState({
                  vehicles: this.state.vehicles,
                  startedEditing_CarMake: true
                });
              }}
            />

            <TextInput
              key={"carmodel" + i}
              style={[Styles.textInput, { color: "green" }]}
              placeholder={
                this.state.startedEditing_CarModel
                  ? "Model"
                  : this.state.vehicles[i].model == null
                  ? "Model"
                  : this.state.vehicles[i].model
              }
              onChangeText={data => {
                this.state.vehicles[i].model = data;
                this.setState({
                  vehicles: this.state.vehicles,
                  startedEditing_CarModel: true
                });
              }}
            />

            <TextInput
              key={"caryear" + i}
              style={[Styles.textInput, { color: "green" }]}
              placeholder={
                this.state.startedEditing_CarYear
                  ? "Year"
                  : this.state.vehicles[i].year == null
                  ? "Year"
                  : this.state.vehicles[i].year.toString()
              }
              onChangeText={data => {
                this.state.vehicles[i].year = Number(data.trim());
                this.setState({
                  vehicles: this.state.vehicles,
                  startedEditing_CarYear: true
                });
              }}
            />

            <TextInput
              key={"plate" + i}
              style={[Styles.textInput, { color: "green" }]}
              placeholder={
                this.state.startedEditing_CarPlate
                  ? "License Plate"
                  : this.state.vehicles[i].plate == null
                  ? "License Plate"
                  : this.state.vehicles[i].plate
              }
              onChangeText={data => {
                this.state.vehicles[i].plate = data;
                this.setState({
                  vehicles: this.state.vehicles,
                  startedEditing_CarPlate: true
                });
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
            placeholder={
              this.state.startedEditing_FirstName
                ? "First Name"
                : this.state.first_name
            }
            onChangeText={data => {
              this.setState({
                first_name: data,
                startedEditing_FirstName: true
              });
            }}
          />

          <TextInput
            style={[Styles.textInput, { color: "green" }]}
            placeholder={
              this.state.startedEditing_LastName
                ? "Last Name"
                : this.state.last_name
            }
            onChangeText={data =>
              this.setState({ last_name: data, startedEditing_LastName: true })
            }
          />

          <TextInput
            style={[Styles.textInput, { color: "green" }]}
            placeholder={
              this.state.startedEditing_Email ? "Email" : this.state.email
            }
            onChangeText={data =>
              this.setState({ email: data, startedEditing_Email: true })
            }
          />

          <TextInput
            style={[Styles.textInput, { color: "green" }]}
            placeholder={
              this.state.startedEditing_NewPassword ? "" : "New Password"
            }
            secureTextEntry={true}
            onChangeText={data =>
              this.setState({
                newPassword: data,
                startedEditing_NewPassword: true
              })
            }
          />

          <TextInput
            style={[Styles.textInput, { color: "rgb(230, 19, 87)" }]}
            placeholder={
              this.state.startedEditing_CurrentPassword
                ? ""
                : "*Current password - Necessary"
            }
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
