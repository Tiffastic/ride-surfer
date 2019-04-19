import React from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableHighlight,
  Button,
  AsyncStorage,
  ActivityIndicator
} from "react-native";
import Colors from "../../constants/Colors";
import { Styles } from "../../constants/Styles";
import { reverseGeocodeAsync } from "expo-location";
import UserSession from "../../network/UserSession";

import { fetchAPI } from "../../network/Backend";
const defaultPic = require("../../assets/images/default-profile.png");

export default class MyRidesDetailsScreen extends React.Component<{
  navigation: any;
}> {
  static navigationOptions = {
    title: "Ride Details"
  };

  constructor(props: any) {
    super(props);
    this.getUserPhoto();
    this.getPassengerDirections();
    // this.getMyPhoto();
  }

  getUserPhoto = async () => {
    fetchAPI("/getUserImage/" + this.state.ridePartner.id)
      .then(response => response.json())
      .then(response => {
        this.setState({ userPhoto: response.userImage });
      })
      .catch(error => {
        console.log(error);
      });
  };

  startChatMessage() {
    this.setState({ chatMessagePressed: true }, () => {
      fetchAPI(
        `/getChatIdAndRecipientPhoto?meId=${this.state.meId}&youId=${
          this.state.ridePartner.id
        }`
      )
        .then(response => response.json())

        .then(responseJson => {
          this.props.navigation.navigate("MessageConversations", {
            recipientImage:
              this.state.userPhoto !== null ? this.state.userPhoto : null,
            recipientId: this.state.ridePartner.id,
            recipientFirstName: this.state.ridePartner.firstName,
            recipientLastName: this.state.ridePartner.lastName,
            recipientEmail: this.state.ridePartner.email,
            chatId: responseJson.chatId,
            userImage: responseJson.userImage
          });

          // this.setState({ mePhoto: result });
        })
        .then(() => this.setState({ chatMessagePressed: false }))
        .catch(err => {
          alert("cannot send message: " + err);
          this.setState({ chatMessagePressed: false });
        });
    });
  }

  state = {
    destination: this.props.navigation.getParam("destination"),
    ridePartner: this.props.navigation.getParam("ridePartner"),
    rideDetails: this.props.navigation.getParam("rideDetails"),
    ridePartnerJourney: this.props.navigation.getParam("ridePartnerJourney"),
    type: this.props.navigation.getParam("type"),
    userPhoto: null,
    meId: this.props.navigation.getParam("meId"),
    myPhoto: null,
    chatMessagePressed: false,
    match: {},
    destinationHumanAddress: null as null | string,
    pickupHumanAddress: null as null | string,
    dropoffHumanAddress: null as null | string,
    directions: []
  };

  getPassengerDirections = () => {
    let origin = [
      this.state.rideDetails.passengerJourney.origin.coordinates[1],
      this.state.rideDetails.passengerJourney.origin.coordinates[0]
    ].join(",");
    let dest = [
      this.state.destination.coordinates.longitude,
      this.state.destination.coordinates.latitude
    ].join(",");
    let coords = [origin, dest].join(";");

    fetchAPI(
      `/journeys/directions?id=${encodeURIComponent(
        this.state.rideDetails.driverJourney.id.toString()
      )}&coords=${encodeURIComponent(coords)}`
    )
      .then(resp => {
        return resp.json();
      })
      .then(json => {
        json.match.key = json.match.journey.id.toString();

        this.setState({
          loading: false,
          match: json.match
        });
      })
      .then(() => {
        this.loadThing1();
        this.loadThing2();
        this.loadThing3();
      })
      .catch(error => {
        console.log(error);
        this.setState({ errorMessage: error.toString() });
      });
  };

  private formatAddress = (response: any) => {
    let address = response.name;
    if (response.street !== null) {
      address += " " + response.street;
    }
    return address;
  };

  private loadThing1 = async () => {
    let response = await reverseGeocodeAsync(
      this.state.destination.coordinates
    );
    if (response.length > 0) {
      let newState: any = {};
      newState["destinationHumanAddress"] = this.formatAddress(response[0]);
      this.setState(newState, this.checkThings);
    }
  };
  private loadThing2 = async () => {
    let response = await reverseGeocodeAsync(this.state.match.ridePlan.pickup);
    if (response.length > 0) {
      let newState: any = {};
      newState["pickupHumanAddress"] = this.formatAddress(response[0]);
      this.setState(newState, this.checkThings);
    }
  };
  private loadThing3 = async () => {
    let response = await reverseGeocodeAsync(this.state.match.ridePlan.dropoff);
    if (response.length > 0) {
      let newState: any = {};
      newState["dropoffHumanAddress"] = this.formatAddress(response[0]);
      this.setState(newState, this.checkThings);
    }
  };
  private checkThings() {
    if (
      this.state.destinationHumanAddress &&
      this.state.pickupHumanAddress &&
      this.state.dropoffHumanAddress
    ) {
      if (this.state.type == "passenger") {
        this.generateDirsFromRidePlan(this.state.match.ridePlan);
      } else {
        this.generateDrivingDirsFromRidePlan(this.state.match.ridePlan);
      }
    }
  }

  componentWillMount = async () => {};

  componentWillUnmount() {
    this.willFocusRideDetails.remove();
  }
  componentDidMount() {
    // make sure that MessageContactsScreen will always refresh when navigate to it
    this.willFocusRideDetails = this.props.navigation.addListener(
      "willFocus",
      () => {
        this.getPassengerDirections();
      }
    );
  }

  startRide = () => {
    this.props.navigation.navigate("RideInProgress", {
      destination: this.state.destination,
      ridePartner: this.state.ridePartner,
      ridePartnerPhoto: this.state.userPhoto,
      rideDetails: this.state.rideDetails,
      ridePartnerJourney: this.state.ridePartnerJourney,
      type: this.state.type
    });
  };

  private generateDirsFromRidePlan(ridePlan: any) {
    let round = (number: number) => Math.round(number * 10) / 10;
    let toMiles = (number: number) => number * 0.621371;
    let dirs = [
      {
        time: round(toMiles(ridePlan.pickup.distance)) + " miles",
        desc: "Walk to " + (this.state.pickupHumanAddress || "pickup")
      },
      {
        time: round(toMiles(ridePlan.drivingDistance)) + " miles",
        desc: "Ride to " + (this.state.dropoffHumanAddress || "dropoff")
      },
      {
        time: round(toMiles(ridePlan.dropoff.distance)) + " miles",
        desc: "Walk to " + (this.state.destinationHumanAddress || "destination")
      }
    ];
    dirs.forEach((d: any, i) => (d.key = i.toString()));
    this.setState({ directions: dirs });
  }

  private generateDrivingDirsFromRidePlan(ridePlan: any) {
    let round = (number: number) => Math.round(number * 10) / 10;
    let toMiles = (number: number) => number * 0.621371;
    let dirs = [
      {
        time: round(toMiles(ridePlan.pickup.distance)) + " miles",
        desc: "Drive to " + (this.state.pickupHumanAddress || "pickup")
      },
      {
        time: round(toMiles(ridePlan.drivingDistance)) + " miles",
        desc: "Drive to " + (this.state.dropoffHumanAddress || "dropoff")
      },
      {
        time: round(toMiles(ridePlan.dropoff.distance)) + " miles",
        desc:
          "Drive to " + (this.state.destinationHumanAddress || "destination")
      }
    ];
    dirs.forEach((d: any, i) => (d.key = i.toString()));
    this.setState({ directions: dirs });
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{ flex: 1, width: undefined, height: undefined }}
          resizeMode="center"
          source={
            this.state.userPhoto !== null
              ? { uri: this.state.userPhoto }
              : defaultPic
          }
        />
        <Text style={{ fontSize: 25, margin: 5 }}>
          {this.state.ridePartner.firstName +
            " " +
            this.state.ridePartner.lastName}
        </Text>

        <Text style={[{ fontSize: 25, margin: 5 }, Styles.colorFlip]}>
          Directions to {this.state.destinationHumanAddress}
        </Text>

        <FlatList
          data={this.state.directions}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, separators }) => (
            <TouchableHighlight
              style={styles.searchResultsItem}
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}
            >
              <View style={styles.flatview}>
                <Text style={[{ flex: 1 }, Styles.colorFlip]}>
                  {(item as any).time}
                </Text>
                <Text style={[{ flex: 2 }, Styles.colorFlip]}>
                  {(item as any).desc}
                </Text>
              </View>
            </TouchableHighlight>
          )}
        />
        {this.state.chatMessagePressed && (
          <View style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }}>
            <ActivityIndicator />
          </View>
        )}
        {!this.state.chatMessagePressed && (
          <View style={{ marginLeft: 10, marginRight: 10, marginBottom: 10 }}>
            <Button
              title="Message"
              color="rgb(36, 167, 217)"
              onPress={() => {
                this.startChatMessage();
              }}
            />
          </View>
        )}

        <Button
          title="Start"
          onPress={this.startRide}
          color={Colors.darkAccent}
        />
      </View>
    );
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
