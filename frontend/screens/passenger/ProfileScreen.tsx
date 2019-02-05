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
      id: "",
      firstName: "Not Found",
      lastName: "",
      email: "",
      carYear: "",
      carMake: "",
      carModel: "",
      carPlate: ""
    }
  };

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
