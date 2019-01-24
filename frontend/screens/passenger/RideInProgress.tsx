import React, { Component, Props } from "react";
import { StyleSheet, Button, View, Dimensions, Platform } from "react-native";

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
};

export default class RideInProgress extends React.Component<
  {
    navigation: any;
  },
  state
> {
  constructor(props: any) {
    super(props);

    console.log(this.props.navigation.getParam("destination"));
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
      markers: []
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
  }

  componentWillUnmount() {
    TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME);
  }

  updateLocation(coords: any) {
    console.log(coords);
    // fetch("http://ride-surfer.herokuapp.com/users/trace/", {
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     email: this.state.email,
    //     password: this.state.password
    //   })
    // })
    //   .then(response => response.json())

    //   .then(responseJson => {
    //     if (responseJson.message == "User Not Found") {
    //       this.setState({
    //         error: "User not found"
    //       });
    //     } else {
    //       this._saveUserAsync(responseJson).catch(console.log);
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  }

  initializeLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    let coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    };
    this.setState({ myLocation: coords });

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced
    });
  };

  getDriverLocation = async () => {};

  render() {
    console.log("in progress");
    console.log(this.state.destinationLocation);
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

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.log(error);
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const locations = data;
    console.log(locations);

    // do something with the locations captured in the background
  }
});

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
