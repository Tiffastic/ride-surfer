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

export default class DriverPickerScreen extends React.Component<{
  navigation: any;
}> {
  state: any = {
    loading: true,
    origin: this.props.navigation.getParam("origin"),
    destination: this.props.navigation.getParam("destination"),
    errorMessage: null,
    drivers: [],
    overallRatings: {}
  };

  private chooseDriver = (item: any) => {
    this.props.navigation.push("DriverDetails", {
      origin: this.state.origin,
      destination: this.state.destination,
      match: item,
      driverJourney: item.journey
    });
  };

  componentDidMount() {
    let origin = [this.state.origin.longitude, this.state.origin.latitude].join(
      ","
    );
    let dest = [
      this.state.destination.longitude,
      this.state.destination.latitude
    ].join(",");
    let coords = [origin, dest].join(";");
    fetchAPI(`/journeys/matches?coords=${encodeURIComponent(coords)}`)
      .then(async resp => {
        let json = await resp.json();
        if (!resp.ok) {
          throw json;
        }
        console.log(JSON.stringify(json));
        json.matches.forEach(res => (res.key = res.journey.id.toString()));

        this.state.drivers = json.matches;
        this.getDriverAvgOverallRatings();

        //read comments inside of getDriverAvgoverallRatigns for explaination.
        //long story short, how do we make getDriver... async, so we can .then
        //right here instead of inside the getDriver... method.
        /*
        this.setState({
          loading: false,
          drivers: json.matches
        });
        */
      })

      .catch(error => {
        console.log(error);
        this.setState({ errorMessage: error.toString() });
      });
  }

  getDriverAvgOverallRatings() {
    var self: any = this;

    var numOfDrivers = 0;
    this.state.drivers.forEach(
      (driver: any) =>
        function() {
          var driverId = driver.journey.User.id;

          fetchAPI("/usersOverallRating/" + driverId)
            .then(resp => resp.json())
            .then(resp => {
              self.state.overallRatings[resp.personRatedId.toString()] =
                resp.avgOverall;

              // CANNOT SET STATE UNTILL THE OVERALL-RATINGS ARRAY IS FILLED, ELSE THE FLATLIST WON'T SHOW THE RATINGS UNLESS WE MANUALLY CLICK ON THE LIST ITEM
              numOfDrivers++;
              if (numOfDrivers === self.state.drivers.length) {
                self.setState({
                  loading: false
                });
              }
            })
            .catch(error => {
              console.log("ERROR  = " + error);
            });
        }.bind(this)() // MUST BIND THE FUNCTION OR ELSE THIS.STATE.<OBJECT> IS UNDEFINED
    );
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
          extraData={this.state}
          renderItem={({ item, separators }: any) => (
            <TouchableHighlight
              style={styles.searchResultsItem}
              onPress={() => this.chooseDriver(item)}
              onShowUnderlay={separators.highlight}
              onHideUnderlay={separators.unhighlight}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* <Image
                  source={item.journey.User.profilePic}
                  style={{ width: 50, height: 50 }}
                /> */}
                <Text style={styles.searchResultsName}>
                  {item.journey.User.firstName}
                </Text>
                {this.state.overallRatings[item.journey.User.id.toString()] ? (
                  <Text style={styles.searchResultsAddress}>
                    {this.state.overallRatings[item.journey.User.id.toString()]}{" "}
                    ★
                  </Text>
                ) : (
                  <Text style={styles.searchResultsAddress}>New Driver</Text>
                )}
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
            pinColor={"green"}
            coordinate={{
              latitude: this.state.origin.latitude,
              longitude: this.state.origin.longitude
            }}
          />
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
    marginBottom: 10,
    flex: 1
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
