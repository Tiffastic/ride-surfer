import React, { Component, Props } from "react";
import {
  StyleSheet,
  Button,
  View,
  Dimensions,
  Platform,
  AppState
} from "react-native";

import NavigateButton from "../../components/NavigateButton";

import Colors from "../../constants/Colors";
import Styles from "../../constants/Styles";

import { Constants, Permissions, Location, TaskManager } from "expo";
import MapView, { Marker } from "react-native-maps";
import { number } from "prop-types";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const LOCATION_TASK_NAME = "background-location-task";

type state = {
  isLoading: boolean;
  driver: { name: string; home: string; class: string; work: string };
  destinationLocation: {
    description: string;
    latitude: number;
    longitude: number;
  };
  driverLocation: { latitude: number; longitude: number };
  myLocation: { latitude: number; longitude: number };
  errorMessage: string;
  markers: Array<{ latitude: number; longitude: number }>;
  appState: string;
};

let lastSaved: Date;

export default class RideInProgress extends React.Component<
  {
    navigation: any;
  },
  state
> {
  constructor(props: any) {
    super(props);

    this.state = {
      isLoading: true,
      myLocation: { latitude: 0, longitude: 0 },
      driverLocation: { latitude: 0, longitude: 0 },
      errorMessage: "",
      driver: this.props.navigation.getParam("driver", {
        name: "Not Found",
        home: "",
        class: "",
        work: ""
      }),
      destinationLocation: this.props.navigation.getParam("destination", {
        description: "Not Found",
        latitude: number,
        longitude: number
      }),
      markers: [],
      appState: AppState.currentState
    };
  }

  componentWillMount() {
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    } else {
      this.initializeLocationAsync();

      this.getDriverLocation();
    }

    this.setState({
      markers: [
        this.state.driverLocation,
        this.state.myLocation,
        this.state.destinationLocation
      ]
    });

    lastSaved = new Date();
  }

  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
  }

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

    saveLocation(1, coords);
    this.setState({ myLocation: coords });
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

  getDriverLocation = async () => {};

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={{ flex: 1 }}
          provider="google"
          region={{
            latitude: this.state.destinationLocation.latitude,
            longitude: this.state.destinationLocation.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }}
        >
          {this.state.isLoading
            ? null
            : this.state.markers.map((marker, index) => {
                const coords = {
                  latitude: marker.latitude,
                  longitude: marker.longitude
                };
                return <Marker key={index} coordinate={coords} />;
              })}
        </MapView>
        <NavigateButton dest={this.state.destinationLocation.description} />

        <View style={Styles.buttonView}>
          <Button
            title="Finish"
            onPress={() => {
              TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME);
              this.props.navigation.navigate("RateDriver", {
                driver: this.state.driver
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
    saveLocation(1, coords);
  }
});

function saveLocation(
  journeyId: number,
  coords: { latitude: number; longitude: number }
) {
  if (lastSaved == undefined) {
    lastSaved = new Date();
  }
  let now: Date = new Date();
  var dif = (now.getTime() - lastSaved.getTime()) / 1000;
  if (dif > 5) {
    fetch("http://ride-surfer.herokuapp.com/traces/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        journeyId: 1,
        location: [coords.latitude, coords.longitude]
      })
    }).catch(error => {
      console.log(error);
    });
    lastSaved = new Date();
  }
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
