import React, { Component } from "react";
import {
  FlatList,
  TouchableHighlight,
  Image,
  StyleSheet,
  Text,
  Button,
  Dimensions,
  View
} from "react-native";

import MapView, { Polyline, Marker } from "react-native-maps";

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
    driverJourney: this.props.navigation.getParam("driverJourney")
  };

  render() {
    // let image = this.state.driver.home;
    // let dirs = this.state.driver.homeDirs;
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
            coordinate={{
              latitude: this.state.match.ridePlan.pickup.longitude,
              longitude: this.state.match.ridePlan.pickup.latitude
            }}
          />
          <Marker
            coordinate={{
              latitude: this.state.match.ridePlan.dropoff.longitude,
              longitude: this.state.match.ridePlan.pickup.latitude
            }}
          />
        </MapView>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 25, margin: 5 }}>
            {this.state.driverJourney.User.name}
          </Text>

          <Text style={{ fontSize: 15, marginLeft: 5 }}>
            Directions to {this.state.destination.name}
          </Text>
          {/* <FlatList
            data={[]}
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
          /> */}
          <Button
            title="Request"
            onPress={this.onRequest}
            color={Colors.darkAccent}
          />
        </View>
      </View>
    );
  }

  onRequest = async () => {
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
      });
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
