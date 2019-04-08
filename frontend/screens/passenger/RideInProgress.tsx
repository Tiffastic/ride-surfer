import React, { Component, Props } from "react";
import {
  StyleSheet,
  Button,
  View,
  Dimensions,
  Platform,
  AppState,
  Image
} from "react-native";

import NavigateButton from "../../components/NavigateButton";
import { fetchAPI } from "../../network/Backend";
import UserSession from "../../network/UserSession";
import Icon from "react-native-vector-icons/FontAwesome";

import Colors from "../../constants/Colors";
import { Styles } from "../../constants/Styles";

import { Constants, Permissions, Location, TaskManager } from "expo";
import MapView, { Marker } from "react-native-maps";
import { number } from "prop-types";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const LOCATION_TASK_NAME = "background-location-task";
const car = <Icon name="car" size={30} color="#900" />;
const person = <Icon name="user" size={30} color="#900" />;
let lastSaved: Date;

export default class RideInProgress extends React.Component<{
  navigation: any;
}> {
  state = {
    myLocation: { latitude: 0, longitude: 0 },
    ridePartnerLocation: { latitude: 0, longitude: 0 },
    errorMessage: "",
    ridePartner: this.props.navigation.getParam("ridePartner"),
    ridePartnerPhoto: this.props.navigation.getParam("ridePartnerPhoto"),
    ridePartnerJourney: this.props.navigation.getParam("ridePartnerJourney"),
    destination: this.props.navigation.getParam("destination"),
    rideDetails: this.props.navigation.getParam("rideDetails"),
    type: this.props.navigation.getParam("type"),
    appState: AppState.currentState,
    myMarkerImage: person,
    partnerMarkerImage: car,
    myId: null
  };

  componentWillMount() {
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    } else {
      this.initializeLocationAsync();
      this.getRidePartnerLocation();
    }

    lastSaved = new Date();
    if (this.state.type === "driver") {
      this.setState({
        myMarkerImage: car,
        partnerMarkerImage: person
      });
    }
  }

  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);

    this.bootstrap();
  }

  bootstrap = async () => {
    let userDetails = await UserSession.get();
    if (userDetails == null) return;

    this.setState({ myId: userDetails.id });
  };

  componentWillUnmount() {
    TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME);
  }

  _handleAppStateChange = async (nextAppState: any) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME);
    } else if (
      this.state.appState === "active" &&
      nextAppState.match(/inactive|background/)
    ) {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.BestForNavigation
      });
    }

    this.setState({ appState: nextAppState });
  };

  updateLocation = async (location: any) => {
    let coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    };

    saveLocation(coords);
    this.setState({ myLocation: coords });

    this.getRidePartnerLocation();
  };

  initializeLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }

    await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.BestForNavigation },
      this.updateLocation
    );
  };

  getRidePartnerLocation = async () => {
    fetchAPI("/journeys/" + this.state.ridePartnerJourney.id, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.message == "Journey Not Found") {
          this.setState({
            errorMessage: "Journey not found"
          });
        } else {
          let partnerLocation = {
            latitude: responseJson.currentLocation.coordinates[0],
            longitude: responseJson.currentLocation.coordinates[1]
          };
          this.setState({
            ridePartnerJourney: responseJson,
            ridePartnerLocation: partnerLocation
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={{ flex: 1 }}
          provider="google"
          region={{
            latitude: this.state.destination.coordinates.latitude,
            longitude: this.state.destination.coordinates.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }}
        >
          <Marker
            coordinate={{
              latitude: this.state.ridePartnerLocation.latitude,
              longitude: this.state.ridePartnerLocation.longitude
            }}
          >
            {this.state.partnerMarkerImage}
          </Marker>
          <Marker coordinate={this.state.myLocation}>
            {this.state.myMarkerImage}
          </Marker>
          <Marker coordinate={this.state.destination.coordinates}>
            <Icon name="flag" size={30} color="#900" />
          </Marker>
        </MapView>
        <NavigateButton
          dest={
            this.state.destination.coordinates.latitude +
            " " +
            this.state.destination.coordinates.longitude
          }
        />
        <View style={Styles.buttonView}>
          <Button
            title="Finish"
            onPress={() => {
              // record ride-sharing miles for both passengers and drivers
              fetchAPI(
                `/finishRideSharingMiles?meId=${
                  this.state.myId
                }&driverJourneyId=${
                  this.state.rideDetails.driverJourneyId
                }&passengerJourneyId=${
                  this.state.rideDetails.passengerJourneyId
                }`
              ).then(async response => {
                console.log("response status = ", response.status);
                if (response.status === 200) {
                  var responseJson = await response.json();
                  alert(
                    `Congrats!\n\nCO2 saved: ${responseJson.co2} kg on ${
                      responseJson.miles
                    } miles`
                  );
                }
              });

              TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME);
              this.props.navigation.navigate("RateDriver", {
                ridePartner: this.state.ridePartner,
                rideDetails: this.state.rideDetails,
                ridePartnerPhoto: this.state.ridePartnerPhoto
              });
            }}
            color={Colors.darkAccent}
          />
        </View>
      </View>
    );
  }
}

TaskManager.defineTask(LOCATION_TASK_NAME, body => {
  let error = body.error;
  let data = body.data as { locations: any };
  let locations = data.locations;
  if (error) {
    console.log(error);
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (locations) {
    let coords = {
      latitude: locations[0].coords.latitude,
      longitude: locations[0].coords.longitude
    };
    saveLocation(coords);
  }
});

function saveLocation(coords: { latitude: number; longitude: number }) {
  if (lastSaved == undefined) {
    lastSaved = new Date();
  }
  let now: Date = new Date();
  var dif = (now.getTime() - lastSaved.getTime()) / 1000;
  if (dif > 10) {
    updateUserLocation(coords);
    // addTrace(coords); // out of control right now

    lastSaved = new Date();
  }
}

function addTrace(
  userId: number,
  coords: { latitude: number; longitude: number }
) {
  //   fetchAPI("/traces/", {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({
  //       journeyId: 1,
  //       location: [coords.latitude, coords.longitude]
  //     })
  //   }).catch(error => {
  //     console.log(error);
  //   });
}

async function updateUserLocation(coords: {
  latitude: number;
  longitude: number;
}) {
  let userDetails = await UserSession.get();
  if (userDetails == null) return;

  fetchAPI("/journeys/updateLocation/", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId: userDetails.id,
      currentLocation: [coords.latitude, coords.longitude]
    })
  }).catch(error => {
    console.log(error);
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  flatview: {
    justifyContent: "center",
    paddingTop: 5,
    borderRadius: 2,
    flexDirection: "row",
    margin: 5
  },
  searchResultsList: {
    marginTop: 10,
    marginBottom: 10
  },
  searchResultsItem: {
    borderColor: "#c3c3c3",
    borderBottomWidth: 1
  }
});
