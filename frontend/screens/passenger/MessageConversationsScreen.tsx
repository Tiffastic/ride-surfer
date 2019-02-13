import React from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableHighlight,
  Button
} from "react-native";
import Colors from "../../constants/Colors";

const defaultPic = require("../../assets/images/default-profile.png");

let dummyDirections: [
  {
    key: "1";
    time: "1 min";
    desc: "Walk to  4689 Holladay Blvd E";
    addr: "4689 Holladay Blvd E";
  },
  { key: "2"; time: "16 mins"; desc: "Drive to 2000 1100 E" },
  { key: "3"; time: "5 mins"; desc: "Walk to 2011 1100 E" }
];

export default class MessageConversationsScreen extends React.Component<{
  navigation: any;
}> {
  static navigationOptions = {
    title: "Ride Details"
  };

  state = {
    destination: this.props.navigation.getParam("destination"),
    ridePartner: this.props.navigation.getParam("ridePartner"),
    rideDetails: this.props.navigation.getParam("rideDetails"),
    ridePartnerJourney: this.props.navigation.getParam("ridePartnerJourney")
  };

  startRide = () => {
    this.props.navigation.navigate("RideInProgress", {
      destination: this.state.destination,
      ridePartner: this.state.ridePartner,
      rideDetails: this.state.rideDetails,
      ridePartnerJourney: this.state.ridePartnerJourney
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Image source={defaultPic} />
        <Text style={{ fontSize: 25, margin: 5 }}>
          {this.state.ridePartner.firstName +
            " " +
            this.state.ridePartner.lastName}
        </Text>

        <Text style={{ fontSize: 15, marginLeft: 5 }}>
          Directions to {this.state.destination.name[0].street}
        </Text>
        <FlatList
          data={dummyDirections}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item: any, index: any) => item.key}
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
