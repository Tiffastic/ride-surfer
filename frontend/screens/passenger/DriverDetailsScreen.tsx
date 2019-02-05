import React, { Component } from "react";
import {
  FlatList,
  TouchableHighlight,
  Image,
  StyleSheet,
  Text,
  Button,
  View
} from "react-native";

import Colors from "../../constants/Colors";
import { number, string } from "prop-types";
import { fetchAPI } from "../../network/Backend";
import UserSession from "../../network/UserSession";

export default class DriverDetailsScreen extends React.Component<{
  navigation: any;
}> {
  state = {
    origin: this.props.navigation.getParam("origin"),
    destination: this.props.navigation.getParam("destination"),
    driver: this.props.navigation.getParam("driver"),
    driverJourney: this.props.navigation.getParam("driverJourney")
  };

  render() {
    let image = this.state.driver.home;
    let dirs = this.state.driver.homeDirs;
    return (
      <View style={styles.container}>
        <Image
          style={{ flex: 1.25, width: undefined, height: undefined }}
          resizeMode="stretch"
          source={image}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 25, margin: 5 }}>
            {this.state.driver.name}
          </Text>

          <Text style={{ fontSize: 15, marginLeft: 5 }}>
            Directions to {this.state.destination.name}
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
