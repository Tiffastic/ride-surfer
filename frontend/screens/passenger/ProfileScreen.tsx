import React from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Button,
  Image
} from "react-native";

import Colors from "../../constants/Colors";

import UserSession from "../../network/UserSession";
import { fetchAPI } from "../../network/Backend";

export default class ProfileScreen extends React.Component<{
  navigation: any;
}> {
  constructor(props: any) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    var userDetails = await UserSession.get();
    if (userDetails == null) throw ":(";
    this.setState({ user: userDetails });
  };
  static navigationOptions = {
    title: "Profile"
  };
  state = {
    user: {
      id: 1,
      firstName: "Not Found",
      lastName: "",
      email: "",
      carYear: "",
      carMake: "",
      carModel: "",
      carPlate: ""
    },
    avgOverallRating: 0,
    avgSafetyRating: 0,
    avgTimelinessRating: 0,
    avgCleanlinessRating: 0
  };

  getAvgOverallRating() {
    console.log("this.state.user.id = " + this.state.user.id);
    fetchAPI("/usersOverallRating/" + this.state.user.id)
      .then(response => response.json())
      .then(response => {
        this.setState({ avgOverallRating: response.avgOverall });
      })
      .catch(error => {
        console.log(error);
      });
  }

  getAvgSafetyRating() {
    fetchAPI("/usersSafetyRating/" + this.state.user.id)
      .then(response => response.json())
      .then(response => this.setState({ avgSafetyRating: response.avgSafety }))
      .catch(error => {
        console.log(error);
      });
  }

  getAvgTimelinessRating() {
    fetchAPI("/usersTimelinessRating/" + this.state.user.id)
      .then(response => response.json())
      .then(response =>
        this.setState({ avgTimelinessRating: response.avgTimeliness })
      )
      .catch(error => {
        console.log(error);
      });
  }

  getAvgCleanlinessRating() {
    fetchAPI("/usersCleanlinessRating/" + this.state.user.id)
      .then(response => response.json())
      .then(response => {
        this.setState({ avgCleanlinessRating: response.avgCleanliness });
      })
      .catch(error => {
        console.log(error);
      });
  }

  getNumber() {
    return 1;
  }

  componentWillMount() {
    this.getAvgOverallRating();
    this.getAvgSafetyRating();
    this.getAvgTimelinessRating();
    this.getAvgCleanlinessRating();
  }

  render() {
    let name = this.state.user.firstName + " " + this.state.user.lastName;
    let car =
      this.state.user.carYear +
      " " +
      this.state.user.carMake +
      " " +
      this.state.user.carModel;
    return (
      <View style={styles.container}>
        <Image
          style={{ flex: 1, width: undefined, height: undefined }}
          resizeMode="center"
          source={require("../../assets/images/default-profile.png")}
        />
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ fontSize: 25, margin: 10 }}>{name}</Text>
          <Text>{this.state.user.email}</Text>
          <Text>{car}</Text>
          <Text>{this.state.user.carPlate}</Text>
        </View>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text>Overall: {this.state.avgOverallRating}</Text>
          <Text>Safety: {this.state.avgSafetyRating}</Text>
          <Text>Timeliness: {this.state.avgTimelinessRating}</Text>
          <Text>Cleanliness: {this.state.avgCleanlinessRating}</Text>
        </View>

        <Button
          title="Register For Push Notification"
          onPress={() =>
            this.props.navigation.navigate("PushNotificationsRegister")
          }
        />

        <Button
          title="Log Out"
          onPress={this._logOut}
          color={Colors.darkAccent}
        />
      </View>
    );
  }

  _logOut = async () => {
    await UserSession.clear();
    this.props.navigation.navigate("Auth");
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff"
  },
  tableRow: {
    flexDirection: "row"
  }
});
