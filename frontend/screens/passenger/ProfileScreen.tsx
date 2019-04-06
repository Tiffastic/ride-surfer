import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Button,
  Image,
  TouchableHighlight,
  AsyncStorage
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "react-navigation";
import HeaderButtons, { HeaderButton } from "react-navigation-header-buttons";
import Colors from "../../constants/Colors";
import Icon from "react-native-vector-icons/FontAwesome";
import UserSession from "../../network/UserSession";
import { fetchAPI } from "../../network/Backend";
import {
  Styles,
  addStylesListener,
  clearStylesListener
} from "../../constants/Styles";
import UpdateProfileScreen from "./UpdateProfileScreen";
import { ImagePicker, Permissions, Constants } from "expo";

const IoniconsHeaderButton = (passMeFurther: any) => (
  // the `passMeFurther` variable here contains props from <Item .../> as well as <HeaderButtons ... />
  // and it is important to pass those props to `HeaderButton`
  // then you may add some information like icon size or color (if you use icons)
  <HeaderButton
    {...passMeFurther}
    IconComponent={Ionicons}
    iconSize={40}
    color={Colors.primary}
    buttonStyle={{
      // backgroundColor: "rgba(92, 99,216, 1)",
      height: 60
      // textAlignVertical: 'center',

      // borderWidth: 0,
      // borderRadius: 5
    }}
  />
);

// import for upload image
//const ImagePicker = require("react-native-image-picker").default;

class ProfileScreen extends React.Component<{
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
      ),
      headerLeft: (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <HeaderButton
            title="ProfileIcon"
            iconName="ios-menu"
            onPress={() => navigation.openDrawer()}
          />
        </HeaderButtons>
      ),
      headerTitleStyle: {
        textAlign: "center",
        fontWeight: "bold",
        height: 45,
        flex: 1
      }
    };
  };

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    this._bootstrapAsync();
  }

  componentWillMount() {
    addStylesListener(this.onStylesChange);
  }
  componentWillUnmount() {
    clearStylesListener(this.onStylesChange);
  }
  private onStylesChange = () => this.forceUpdate();

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    var userDetails = await UserSession.get();
    if (userDetails == null) throw ":(";
    this.setState({ user: userDetails });

    AsyncStorage.getItem("userImage").then(item => {
      this.setState({ userPhoto: item });
    });

    this.getRatings();
    this.getUserPhoto();
  };

  state = {
    user: {
      id: "",
      firstName: "Not Found",
      lastName: "",
      email: "",
      vehicles: [{}]
    },
    avgOverallRating: null as null | number,
    avgSafetyRating: null as null | number,
    avgTimelinessRating: null as null | number,
    avgCleanlinessRating: null as null | number,

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

  getUserPhoto = async () => {
    // when User logs in, their image is stored in Async Storage
    /*
    AsyncStorage.getItem("userImage").then(item => {
      this.setState({ userPhoto: item });
    });
    */

    fetchAPI("/getUserImage/" + this.state.user.id)
      .then(response => response.json())
      .then(response => {
        this.setState({ userPhoto: response.userImage });
        AsyncStorage.setItem("userImage", response.userImage); // save user image in async storage
      })
      .catch(error => {
        console.log(error);
      });
  };

  takeUserPhoto = async () => {
    const { status: cameraPerm } = await Permissions.askAsync(
      Permissions.CAMERA
    );

    const { status: cameraRollPerm } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    // only if user allows permission to camera AND camera roll

    if (cameraPerm === "granted" && cameraRollPerm === "granted") {
      let photo = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [2, 2],
        base64: true // there is a base64 property in ImagePicker, so I don't know why this is underlined red.  But it works.
      });

      this.savePhotoInDatabase(photo);
    }
  };

  uploadUserPhoto = async () => {
    // get permission from user to access their mobile photos
    const { status: cameraRollPerm } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    // if user gives permission, then pull up the user's photo gallery and store that photo's uri in the state
    if (cameraRollPerm === "granted") {
      let photo = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [2, 2],
        mediaTypes: "Images",
        base64: true // there is a base64 property in ImagePicker, so I don't know why this is underlined red.  But it works.
      });

      this.savePhotoInDatabase(photo);
    } // end of in permission granted if statement
  };

  savePhotoInDatabase = async (photo: any) => {
    if (!photo.cancelled) {
      var imageData = "data:image/jpeg;base64," + photo.base64;

      AsyncStorage.setItem("userImage", imageData); // save user image in async storage

      this.setState({
        userPhoto: imageData
      });

      // send photo to server
      await fetchAPI("/updateBios/" + this.state.user.id, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ image: imageData })
      });
    }
  };
  /*
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

        // store user picture in Async Storage
        AsyncStorage.setItem("userImage", imageData);

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

  */
  render() {
    let name = this.state.user.firstName + " " + this.state.user.lastName;

    let round = (number: number) => Math.round(number * 10) / 10;

    return (
      <View style={Styles.containerProfile}>
        <View style={{ flexDirection: "row" }}>
          <TouchableHighlight
            style={{
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.2)",
              alignItems: "center",
              justifyContent: "center",
              width: 150,
              height: 150,
              borderRadius: 75
            }}
          >
            <Image
              style={{ height: 150, width: 150, borderRadius: 75 }}
              resizeMode="center"
              source={
                this.state.userPhoto !== null
                  ? { uri: this.state.userPhoto }
                  : require("../../assets/images/default-profile.png")
              }
            />
          </TouchableHighlight>
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
          {this.state.user.vehicles &&
            this.state.user.vehicles[0] &&
            this.state.user.vehicles[0].year !== null &&
            this.state.user.vehicles[0].make !== null &&
            this.state.user.vehicles[0].model !== null &&
            this.state.user.vehicles[0].plate !== null && (
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
            )}
        </View>

        <View style={{ flex: 1, alignItems: "center", margin: 10 }}>
          {this.state.avgOverallRating !== null && (
            <Text style={{ fontSize: 18 }}>
              Overall: {round(this.state.avgOverallRating)} ★
            </Text>
          )}
          {this.state.avgSafetyRating !== null && (
            <Text style={{ fontSize: 18 }}>
              Safety: {round(this.state.avgSafetyRating)} ★
            </Text>
          )}
          {this.state.avgTimelinessRating !== null && (
            <Text style={{ fontSize: 18 }}>
              Timeliness: {round(this.state.avgTimelinessRating)} ★
            </Text>
          )}
          {this.state.avgCleanlinessRating !== null && (
            <Text style={{ fontSize: 18 }}>
              Cleanliness: {round(this.state.avgCleanlinessRating)} ★
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
          title="Take picture"
          onPress={() => {
            this.takeUserPhoto();
          }}
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

export default createStackNavigator(
  {
    //RouteConfigs
    HomeScreen: {
      screen: ProfileScreen,
      navigationOptions: ({ navigation }: { navigation: any }) => ({
        headerTitle: "Profile",
        headerRight: (
          <Button
            onPress={() => navigation.navigate("UpdateProfile")}
            title="Edit"
          />
        )
      })
    },
    UpdateProfile: UpdateProfileScreen
  },
  {
    initialRouteName: "HomeScreen"
  }
);

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
