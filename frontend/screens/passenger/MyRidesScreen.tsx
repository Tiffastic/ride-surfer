import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  FlatList,
  Button,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { createStackNavigator } from "react-navigation";
import HeaderButtons, { HeaderButton } from "react-navigation-header-buttons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Location } from "expo";
import Colors from "../../constants/Colors";
import { fetchAPI } from "../../network/Backend";
import UserSession from "../../network/UserSession";
import MyRidesDetailsScreen from "./MyRidesDetailsScreen";
import GenericProfileScreen from "./GenericProfileScreen";
import { Styles } from "../../constants/Styles";

const defaultPic = require("../../assets/images/default-profile.png");

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

class MyRidesScreen extends React.Component<{
  navigation: any;
}> {
  constructor(props: any) {
    super(props);
    this.fetchRides();
  }

  state: any = {
    isLoading: true,
    drivingRides: [],
    passengerRides: [],
    driversPhotos: {},
    passengersPhotos: {}
  };

  fetchRides = async () => {
    await Promise.all([
      this.fetchDrivingRides(),
      this.fetchPassengerRides(),
      this.getMyDriversPhotos(),
      this.getMyPassengersPhotos()
    ]);
    this.setState({ isLoading: false });
  };

  fetchDrivingRides = async () => {
    let userDetails = await UserSession.get();
    if (userDetails == null) return;

    fetchAPI("/passengerRides/drive/" + userDetails.id, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.message == "Ride Not Found") {
          this.setState({
            errorMessage: "Ride not found"
          });
        } else {
          this.setState({ drivingRides: responseJson });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  fetchPassengerRides = async () => {
    let userDetails = await UserSession.get();
    if (userDetails == null) return;

    fetchAPI("/passengerRides/passenger/" + userDetails.id, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.message == "Ride Not Found") {
          this.setState({
            errorMessage: "Ride not found"
          });
        } else {
          this.setState({ passengerRides: responseJson });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  messageSelected = (item: any, type: string) => {
    let ridePartnerJourney: any;
    let ridePartner: any;
    let coords: any;

    if (type == "passenger") {
      let destination = item.passengerJourney.destination;
      coords = {
        latitude: destination.coordinates[0],
        longitude: destination.coordinates[1]
      };
      ridePartner = item.driverJourney.User;
      ridePartnerJourney = item.driverJourney;
    } else if (type == "driver") {
      let destination = item.driverJourney.destination;
      coords = {
        latitude: destination.coordinates[0],
        longitude: destination.coordinates[1]
      };
      ridePartner = item.passengerJourney.User;
      ridePartnerJourney = item.passengerJourney;
    }

    Location.reverseGeocodeAsync(coords).then(addresses => {
      let details = { name: addresses, coordinates: coords };
      this.props.navigation.push("MyRidesDetailsScreen", {
        destination: details,
        ridePartner: ridePartner,
        ridePartnerJourney: ridePartnerJourney,
        type: type,
        rideDetails: item
      });
    });
  };

  answerRequest = (item: any, response: boolean) => {
    fetchAPI("/passengerRides/" + item.id, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        driverAccepted: response
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.message == "Ride Not Found") {
          this.setState({
            errorMessage: "Ride not found"
          });
        }
      })
      .then(() => {
        this.fetchDrivingRides();
      })
      .catch(error => {
        console.log(error);
      });
  };

  getMyPassengersPhotos = async () => {
    let userDetails = await UserSession.get();
    if (userDetails == null) return;

    fetchAPI("/myPassengersPhotos/" + userDetails.id)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ passengersPhotos: responseJson });
      })
      .catch(error => console.log("ERROR = ", error));
  };

  getMyDriversPhotos = async () => {
    let userDetails = await UserSession.get();
    if (userDetails == null) return;

    fetchAPI("/myDriversPhotos/" + userDetails.id)
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ driversPhotos: responseJson });
      })
      .catch(error => console.log("ERROR = ", error));
  };

  viewProfile = (item: any) => {
    let user = {
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      vehicles: item.vehicles
    };
    this.props.navigation.push("GenericProfileScreen", {
      user: user
    });
  };

  render() {
    if (this.state.isLoading) {
      return <ActivityIndicator />;
    }
    return (
      <View style={styles.container}>
        <ScrollView>
          {this.state.drivingRides.length > 0 && (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.name}>My Drives</Text>
            </View>
          )}
          <FlatList
            style={styles.searchResultsList}
            data={this.state.drivingRides}
            extraData={this.state}
            keyExtractor={(item: any, index: any) => item.id}
            renderItem={({ item, separators }: any) => (
              <TouchableHighlight
                style={styles.messageButton}
                underlayColor="orange"
                onPress={() => this.messageSelected(item, "driver")}
              >
                <View style={styles.row}>
                  <TouchableOpacity
                    onPress={() => this.viewProfile(item.passengerJourney.User)}
                  >
                    <Image
                      source={
                        this.state.passengersPhotos[
                          item.passengerJourney.User.id.toString()
                        ] === null
                          ? defaultPic
                          : {
                              uri: this.state.passengersPhotos[
                                item.passengerJourney.User.id.toString()
                              ]
                            }
                      }
                      style={{ width: 80, height: 80, borderRadius: 40 }}
                    />
                  </TouchableOpacity>
                  <View style={styles.imageHolder}>
                    <Text>
                      {item.passengerJourney.User.firstName +
                        " " +
                        item.passengerJourney.User.lastName}
                    </Text>
                  </View>
                  {item.driverAccepted === null && (
                    <View style={styles.row}>
                      <Button
                        title="Accept"
                        onPress={() => this.answerRequest(item, true)}
                        color={Colors.darkAccent}
                      />
                      <Button
                        title="Decline"
                        onPress={() => this.answerRequest(item, false)}
                        color={Colors.darkAccent}
                      />
                    </View>
                  )}
                  {item.driverAccepted && (
                    <Text style={{ margin: 10 }}>Accepted</Text>
                  )}
                  {item.driverAccepted === false && (
                    <Text style={{ margin: 10 }}>Declined</Text>
                  )}
                </View>
              </TouchableHighlight>
            )}
          />
          {this.state.passengerRides.length > 0 && (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.name}>My Rides</Text>
            </View>
          )}
          <FlatList
            style={styles.searchResultsList}
            data={this.state.passengerRides}
            extraData={this.state}
            keyExtractor={(item: any, index: any) => item.id}
            renderItem={({ item, separators }: any) => (
              <TouchableHighlight
                style={styles.messageButton}
                underlayColor="orange"
                onPress={() => this.messageSelected(item, "passenger")}
              >
                <View style={styles.row}>
                  <TouchableOpacity
                    onPress={() => this.viewProfile(item.driverJourney.User)}
                  >
                    <Image
                      source={
                        this.state.driversPhotos[
                          item.driverJourney.User.id.toString()
                        ] === null
                          ? defaultPic
                          : {
                              uri: this.state.driversPhotos[
                                item.driverJourney.User.id.toString()
                              ]
                            }
                      }
                      style={{ width: 80, height: 80, borderRadius: 40 }}
                    />
                  </TouchableOpacity>
                  <View style={styles.imageHolder}>
                    <Text>
                      {item.driverJourney.User.firstName +
                        " " +
                        item.driverJourney.User.lastName}
                    </Text>
                  </View>
                  {item.driverAccepted === null && (
                    <Text style={{ margin: 10 }}>No Response</Text>
                  )}
                  {item.driverAccepted && (
                    <Text style={{ margin: 10 }}>Accepted</Text>
                  )}
                  {item.driverAccepted === false && (
                    <Text style={{ margin: 10 }}>Declined</Text>
                  )}
                </View>
              </TouchableHighlight>
            )}
          />
        </ScrollView>
      </View>
    );
  }
}

export default createStackNavigator(
  {
    //RouteConfigs
    MyRidesScreen: {
      screen: MyRidesScreen,
      navigationOptions: ({ navigation }: { navigation: any }) => ({
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
      })
    },
    MyRidesDetailsScreen: MyRidesDetailsScreen,
    GenericProfileScreen: GenericProfileScreen
  },
  {
    initialRouteName: "MyRidesScreen"
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(255, 255, 255)"
  },

  messageButton: {
    margin: 12,
    borderBottomColor: "rgba(206, 206, 206, 1)",
    borderBottomWidth: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    padding: 10,
    paddingRight: 40,
    backgroundColor: "rgba(255, 255, 255, .8)"
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10
  },

  imageHolder: {
    marginLeft: 10
  },

  name: {
    fontSize: 33
  },

  searchResultsList: {
    marginTop: 10,
    marginBottom: 10
  }
});
