import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Button,
  Image,
  ShadowPropTypesIOS
} from "react-native";

import Colors from "../../constants/Colors";
import Icon from "react-native-vector-icons/FontAwesome";

import UserSession from "../../network/UserSession";
import { fetchAPI } from "../../network/Backend";
import Styles from "../../constants/Styles";

import { ImagePicker, Permissions, Constants } from "expo";

// import for upload image
//const ImagePicker = require("react-native-image-picker").default;

export default class ProfileScreen extends React.Component<{
  navigation: any;
}> {
  static navigationOptions = ({ navigation }: any) => {
    return {
      headerTitle: "Profile",
      headerRight: (
        <Button
          onPress={() => navigation.navigate("UpdateProfile")}
          title="Edit"
        />
      )
    };
  };

  constructor(props: any) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    var userDetails = await UserSession.get();
    if (userDetails == null) throw ":(";
    this.setState({ user: userDetails });

    this.getUserPhoto();
    this.getRatings();
  };

  state = {
    user: {
      id: "",
      firstName: "Not Found",
      lastName: "",
      email: "",
      vehicles: [{}]
    },
    avgOverallRating: 0,
    avgSafetyRating: 0,
    avgTimelinessRating: 0,
    avgCleanlinessRating: 0,

    userPhoto: null
  };

  updateProfile() {}

  getAvgOverallRating() {
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

  getRatings() {
    this.getAvgOverallRating();
    this.getAvgSafetyRating();
    this.getAvgTimelinessRating();
    this.getAvgCleanlinessRating();
  }

  getUserPhoto() {
    fetchAPI("/getUserImage/" + this.state.user.id)
      .then(response => response.json())
      .then(response => {
        this.setState({ userPhoto: response.userImage });
      })
      .catch(error => {
        console.log(error);
      });
  }

  uploadUserPhoto = async () => {
    // get permission from user to access their mobile photos
    const { status: cameraRollPerm } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    // if user gives permission, then pull up the user's photo gallery and store that photo's uri in the state
    if (cameraRollPerm === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [2, 2],
        mediaTypes: "Images",
        base64: true // there is a base64 property in ImagePicker, so I don't know why this is underlined red.  But it works.
      });

      if (!result.cancelled) {
        // this.setState({ userPhoto: result.uri });
        var imageData = "data:image/jpeg;base64," + result.base64;
        this.setState({
          userPhoto: imageData
        });

        // send photo to server

        fetchAPI("/updateBios/" + this.state.user.id, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ image: imageData })
        });
      }
    } // end of in permission granted if statement
  };

  render() {
    let name = this.state.user.firstName + " " + this.state.user.lastName;
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{ width: 150, height: 150, borderRadius: 70 }}
            resizeMode="center"
            source={
              this.state.userPhoto !== null
                ? { uri: this.state.userPhoto }
                : require("../../assets/images/default-profile.png")
            }
          />
          <View style={{ marginLeft: -15, justifyContent: "flex-end" }}>
            <Icon
              name="pencil"
              size={30}
              color={Colors.darkAccent}
              onPress={this.uploadUserPhoto.bind(this)}
            />
          </View>
        </View>
        <View style={{ flex: 2, alignItems: "center" }}>
          <Text style={{ fontSize: 34, margin: 10 }}>{name}</Text>
          <Text style={{ fontSize: 20 }}>{this.state.user.email}</Text>
          <FlatList
            data={this.state.user.vehicles}
            extraData={this.state}
            keyExtractor={(item: any, index: any) => item.id}
            renderItem={({ item, separators }: any) => (
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ fontSize: 20 }}>
                  {item.year + " " + item.make + " " + item.model}
                </Text>
                <Text style={{ fontSize: 20 }}>{item.plate}</Text>
              </View>
            )}
          />
        </View>

        <View style={{ flex: 1, alignItems: "center", margin: 10 }}>
          {this.state.avgOverallRating === undefined && (
            <Text style={{ fontSize: 18 }}>
              Overall: {this.state.avgOverallRating} ★
            </Text>
          )}
          {this.state.avgSafetyRating === undefined && (
            <Text style={{ fontSize: 18 }}>
              Safety: {this.state.avgSafetyRating} ★
            </Text>
          )}
          {this.state.avgTimelinessRating === undefined && (
            <Text style={{ fontSize: 18 }}>
              Timeliness: {this.state.avgTimelinessRating} ★
            </Text>
          )}
          {this.state.avgCleanlinessRating === undefined && (
            <Text style={{ fontSize: 18 }}>
              Cleanliness: {this.state.avgCleanlinessRating} ★
            </Text>
          )}
          {!this.state.avgOverallRating &&
            !this.state.avgSafetyRating &&
            !this.state.avgTimelinessRating &&
            !this.state.avgCleanlinessRating && (
              <Text style={{ fontSize: 18 }}>No ratings yet</Text>
            )}
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
    backgroundColor: "#fff",
    alignItems: "center"
  },
  tableRow: {
    flexDirection: "row"
  },
  uploadButton: {
    width: 256,
    height: 50,
    backgroundColor: "blue"
  }
});
