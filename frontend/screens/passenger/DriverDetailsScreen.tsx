import React, { Component } from "react";
import {
  FlatList,
  TouchableHighlight,
  ActivityIndicator,
  StyleSheet,
  Text,
  Button,
  Dimensions,
  View,
  Alert
} from "react-native";

import MapView, { Polyline, Marker } from "react-native-maps";
import { reverseGeocodeAsync } from "expo-location";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

import Colors from "../../constants/Colors";
import { number, string } from "prop-types";
import { fetchAPI } from "../../network/Backend";
import UserSession from "../../network/UserSession";
import { State } from "react-native-gesture-handler";

export default class DriverDetailsScreen extends React.Component<{
  navigation: any;
}> {
  state = {
    origin: this.props.navigation.getParam("origin"),
    destination: this.props.navigation.getParam("destination"),
    match: this.props.navigation.getParam("match"),
    driverJourney: this.props.navigation.getParam("driverJourney"),
    destinationHumanAddress: null as null | string,
    pickupHumanAddress: null as null | string,
    dropoffHumanAddress: null as null | string,
    isLoading: false
  };

  componentWillMount() {
    let ridePlan = this.state.match.ridePlan;
    let formatAddress = (response: any) => {
      let address = response.name;
      if (response.street !== null) {
        address += " " + response.street;
      }
      return address;
    };
    let geocodeAddress = (coords: any, stateKey: string) => {
      reverseGeocodeAsync(coords).then(response => {
        if (response.length > 0) {
          let newState: any = {};
          newState[stateKey] = formatAddress(response[0]);
          this.setState(newState);
        }
      });
    };
    geocodeAddress(this.state.destination, "destinationHumanAddress");
    geocodeAddress(ridePlan.pickup, "pickupHumanAddress");
    geocodeAddress(ridePlan.dropoff, "dropoffHumanAddress");
  }

  private generateDirsFromRidePlan(ridePlan: any) {
    let round = (number: number) => Math.round(number * 10) / 10;
    let dirs = [
      {
        time: round(ridePlan.pickup.distance) + " km",
        desc: "Walk to " + (this.state.pickupHumanAddress || "pickup")
      },
      {
        time: round(ridePlan.drivingDistance) + " km",
        desc: "Ride to " + (this.state.dropoffHumanAddress || "dropoff")
      },
      {
        time: round(ridePlan.dropoff.distance) + " km",
        desc: "Walk to " + (this.state.destinationHumanAddress || "destination")
      }
    ];
    dirs.forEach((d: any, i) => (d.key = i));
    return dirs;
  }

  render() {
    let ridePlan = this.state.match.ridePlan;

    let dirs = this.generateDirsFromRidePlan(ridePlan);

    return (
      <View style={styles.container}>
        <MapView
          style={{ flex: 1.25 }}
          provider="google"
          region={{
            latitude: this.state.destination.latitude,
            longitude: this.state.destination.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }}
        >
          <Polyline
            coordinates={this.state.driverJourney.path.coordinates.map(
              (c: number[]) => ({ latitude: c[1], longitude: c[0] })
            )}
            strokeWidth={2}
          />
          <Marker pinColor={"green"} coordinate={this.state.origin} />
          <Marker coordinate={this.state.destination} />
          <Marker
            pinColor={"blue"}
            coordinate={{
              latitude: this.state.match.ridePlan.pickup.latitude,
              longitude: this.state.match.ridePlan.pickup.longitude
            }}
          />
          <Marker
            pinColor={"pink"}
            coordinate={{
              latitude: this.state.match.ridePlan.dropoff.latitude,
              longitude: this.state.match.ridePlan.dropoff.longitude
            }}
          />
        </MapView>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 25, margin: 5 }}>
            {this.state.driverJourney.User.firstName}
          </Text>

          <Text style={{ fontSize: 15, marginLeft: 5 }}>
            Directions to {this.state.destinationHumanAddress}
          </Text>

          <FlatList
            data={dirs}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, separators }) => (
              <TouchableHighlight
                style={styles.searchResultsItem}
                onShowUnderlay={separators.highlight}
                onHideUnderlay={separators.unhighlight}
              >
                <View style={styles.flatview}>
                  <Text style={{ flex: 1 }}>{(item as any).time}</Text>
                  <Text style={{ flex: 2 }}>{(item as any).desc}</Text>
                </View>
              </TouchableHighlight>
            )}
          />
          {this.state.isLoading ? (
            <View style={{ flex: 2 }}>
              <ActivityIndicator
                size="large"
                style={{
                  zIndex: 5,
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center"
                }}
              />
            </View>
          ) : (
            <Button
              title="Request"
              onPress={this.onRequest}
              color={Colors.darkAccent}
            />
          )}
        </View>
      </View>
    );
  }

  onRequest = async () => {
    this.setState({ isLoading: true });

    //Send a push notification to driver that passenger wants a ride
    fetchAPI(
      "/ridePushNotificationRequest?driverId=" +
        this.state.driverJourney.User.id
    );

    let userDetails = await UserSession.get();
    if (userDetails == null) return;

    fetchAPI("/journeys/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: userDetails.id,
        origin: [this.state.origin.latitude, this.state.origin.longitude],
        destination: [
          this.state.destination.latitude,
          this.state.destination.longitude
        ],
        isDriver: false
      })
    })
      .then(journeyResponse => journeyResponse.json())

      .then(journeyResponseJson => {
        if (journeyResponseJson.message == "Journey Not Found") {
          this.setState({
            errorMessage: "Journey not found"
          });
        } else {
          fetchAPI("/passengerRides/", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              passengerJourneyId: journeyResponseJson.id,
              driverJourneyId: this.state.driverJourney.id
            })
          })
            .then(response => response.json())

            .then(responseJson => {
              if (responseJson.message == "Ride Not Found") {
                this.setState({
                  errorMessage: "Error Sending Request"
                });
              } else {
                this.setState({ isLoading: false });
                Alert.alert(
                  "Your request was sent!",
                  "Go to the messages screen to view your ride requests."
                );
                this.props.navigation.popToTop();
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      })
      .catch(error => {
        console.log(error);
      })
      .then(() => this.setState({ isLoading: false }));
  };
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
