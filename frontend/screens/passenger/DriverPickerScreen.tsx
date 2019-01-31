import React from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableHighlight,
  StyleSheet,
  ListRenderItemInfo,
  ActivityIndicator,
  Image,
  Dimensions
} from "react-native";
import { ListRenderItem } from "react-native";
import MapView, { Marker } from "react-native-maps";

import Styles from "../../constants/Styles";
import { fetchAPI } from "../../network/Backend";
import { number, string } from "prop-types";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const dummyDrivers = [
  {
    key: "shaggy",
    name: "Shaggy",
    rating: 4.2,
    home: require("../../assets/images/h-s1.png"),
    class: require("../../assets/images/h-l1.png"),
    work: require("../../assets/images/h-w1.png"),
    homeDirs: [
      {
        key: "1",
        time: "1 min",
        desc: "Walk to  4689 Holladay Blvd E",
        addr: "4689 Holladay Blvd E"
      },
      { key: "2", time: "16 mins", desc: "Drive to 2000 1100 E" },
      { key: "3", time: "5 mins", desc: "Walk to 2011 1100 E" }
    ],
    workDirs: [
      {
        key: "1",
        time: "5 mins",
        desc: "Walk to 4501 2565 E",
        addr: "4501 2565 E"
      },
      { key: "2", time: "15 mins", desc: "Drive to 290 1500 E" },
      { key: "3", time: "2 mins", desc: "Walk to 295 1500 E" }
    ],
    classDirs: [
      {
        key: "1",
        time: "5 mins",
        desc: "Walk to 4501 2565 E",
        addr: "4501 2565 E"
      },
      { key: "2", time: "15 mins", desc: "Drive to 70 Central Campus Drive" },
      { key: "3", time: "2 mins", desc: "Walk to 72 Central Campus Dr" }
    ],
    profilePic: require("../../assets/images/shaggy.jpg")
  },
  {
    key: "fred",
    name: "Fred",
    rating: 3.4,
    home: require("../../assets/images/h-s2.png"),
    class: require("../../assets/images/h-l2.png"),
    work: require("../../assets/images/h-w2.png"),
    homeDirs: [
      {
        key: "1",
        time: "6 mins",
        desc: "Walk to 2301 E Sky Pines Ct",
        addr: "2301 E Sky Pines Ct"
      },
      { key: "2", time: "16 mins", desc: "Drive to 2000 1100 E" },
      { key: "3", time: "2 mins", desc: "Walk to 2011 1100 E" }
    ],
    workDirs: [
      {
        key: "1",
        time: "1 min",
        desc: "Walk to 4689 Holladay Blvd E",
        addr: "4689 Holladay Blvd E"
      },
      { key: "2", time: "15 mins", desc: "Drive to 290 1500 E" },
      { key: "3", time: "2 mins", desc: "Walk to 295 1500 E" }
    ],
    classDirs: [
      {
        key: "2",
        time: "5 mins",
        desc: "Walk to 4501 2565 E",
        addr: "4501 2565 E"
      },
      { key: "2", time: "15 mins", desc: "Drive to 70 Central Campus Drive" },
      { key: "3", time: "2 mins", desc: "Walk to 72 Central Campus Dr" }
    ],
    profilePic: require("../../assets/images/fred.jpg")
  },
  {
    key: "daphne",
    name: "Daphne",
    rating: 4.8,
    home: require("../../assets/images/h-s3.png"),
    class: require("../../assets/images/h-l3.png"),
    work: require("../../assets/images/h-w3.png"),
    homeDirs: [
      {
        key: "1",
        time: "5 mins",
        desc: "Walk to 4501 2565 E",
        addr: "4501 2565 E"
      },
      { key: "2", time: "16 mins", desc: "Drive to 2000 1100 E" },
      { key: "3", time: "2 mins", desc: "Walk to 2011 1100 E" }
    ],
    workDirs: [
      {
        key: "1",
        time: "6 mins",
        desc: "Walk to 2301 E Sky Pines Ct",
        addr: "2301 E Sky Pines Ct"
      },
      { key: "2", time: "15 mins", desc: "Drive to 290 1500 E" },
      { key: "3", time: "2 mins", desc: "Walk to 295 1500 E" }
    ],
    classDirs: [
      {
        key: "1",
        time: "1 min",
        desc: "Walk to 4689 Holladay Blvd E",
        addr: "4689 Holladay Blvd E"
      },
      { key: "2", time: "15 mins", desc: "Drive to 70 Central Campus Drive" },
      { key: "3", time: "2 mins", desc: "Walk to 72 Central Campus Dr" }
    ],
    profilePic: require("../../assets/images/daphne.jpg")
  }
];

export default class DriverPickerScreen extends React.Component<{
  navigation: any;
}> {
  state = {
    loading: true,
    destination: this.props.navigation.getParam("destination", {
      description: string,
      latitude: number,
      lontitude: number
    }),
    errorMessage: null,
    drivers: []
  };

  private chooseDriver = (item: any) => {
    this.props.navigation.push("DriverDetails", {
      destination: this.state.destination,
      driver: dummyDrivers[0]
    });
  };

  componentDidMount() {
    fetchAPI("/journeys/matches")
      .then(resp => resp.json())
      .then(json => {
        json.forEach(res => (res.key = res.id.toString()));
        this.setState({
          loading: false,
          drivers: json
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({ errorMessage: error.toString() });
      });
  }

  render() {
    let image = this.state.destination.preview;

    if (this.state.errorMessage) {
      return (
        <View>
          <Text style={{ color: "red" }}>Something went wrong:</Text>
          <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
        </View>
      );
    }

    let content = (
      <View style={{ flex: 2 }}>
        <Text style={Styles.paragraphText}>
          We found {this.state.drivers.length} drivers going a similar
          direction:
        </Text>

        <FlatList
          style={styles.searchResultsList}
          data={this.state.drivers}
          renderItem={({ item, separators }: any) => (
            <TouchableHighlight
              style={styles.searchResultsItem}
              onPress={() => this.chooseDriver(item)}
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={item.User.profilePic}
                  style={{ width: 50, height: 50 }}
                />
                <Text style={styles.searchResultsName}>
                  {item.User.firstName}
                </Text>
                <Text style={styles.searchResultsAddress}>
                  {item.User.rating || "-"} stars
                </Text>
              </View>
            </TouchableHighlight>
          )}
        />
      </View>
    );

    return (
      <View style={styles.container}>
        <MapView
          style={{ flex: 2 }}
          provider="google"
          region={{
            latitude: this.state.destination.latitude,
            longitude: this.state.destination.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }}
        >
          <Marker
            coordinate={{
              latitude: this.state.destination.latitude,
              longitude: this.state.destination.longitude
            }}
          />
        </MapView>

        {this.state.loading ? (
          <View style={{ flex: 2 }}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          content
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  queryBox: {
    borderColor: "#c3c3c3",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    fontSize: 36
  },
  searchResultsList: {
    marginTop: 10,
    marginBottom: 10
  },
  searchResultsItem: {
    borderColor: "#c3c3c3",
    borderBottomWidth: 1
  },
  searchResultsName: {
    fontSize: 20,
    marginRight: 10
  },
  searchResultsAddress: {
    fontSize: 20,
    color: "grey"
  }
});
