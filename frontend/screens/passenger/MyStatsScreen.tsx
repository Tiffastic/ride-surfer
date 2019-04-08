import React from "react";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  Image,
  ScrollView,
  Linking,
  TouchableHighlight
} from "react-native";

import { fetchAPI } from "../../network/Backend";
import UserSession from "../../network/UserSession";

//https://elpijimelon.files.wordpress.com/2015/04/planet-bumi-1.jpg
const planetPic = require("../../assets/images/planet.jpg");

if (Platform.OS === "android") {
  var headerMode: any = null;
}

export default class MyStatsScreen extends React.Component<{
  navigation: any;
}> {
  static navigationOptions = {
    header: headerMode
  };

  constructor(props: any) {
    super(props);
  }

  state = {
    myTotalRideSharingMiles: "X",
    myTotalCO2Saved: "Y"
  };

  componentDidMount() {
    this.bootstrap();
  }

  bootstrap = async () => {
    let userDetails = await UserSession.get();
    if (userDetails == null) return;

    fetchAPI(`/calculateStatsFromSurfMiles?meId=${userDetails.id}`).then(
      async response => {
        if (response.status === 200) {
          var responseJson = await response.json();

          this.setState({
            myTotalRideSharingMiles: responseJson.totalMiles,
            myTotalCO2Saved: responseJson.totalCO2
          });
        } else {
          alert("Sorry, couldn't retrieve stats information");
        }
      }
    );
  };

  goToWebsite(url: string) {
    if (Platform.OS === "android") {
      console.log("click picture");
      Linking.openURL(url);
    } else {
      LinkingIOS.openURL("http://google.com");
    }
  }

  render() {
    // after user click finish
    // store their ride sharing miles in a table: RideShareMiles
    // UserID, Miles
    // based on their miles, show their stats

    return (
      <ScrollView>
        <View style={{ alignItems: "center" }}>
          <View style={{ marginTop: 100 }}>
            <Text style={[styles.statsHeading, { color: "rgb(33, 120, 216)" }]}>
              Ride-Surfing Miles
            </Text>
            <Text style={styles.statsData}>
              {this.state.myTotalRideSharingMiles}
            </Text>
          </View>

          <View style={{ marginTop: 30 }}>
            <Text style={[styles.statsHeading, { color: "green" }]}>
              CO2 Savings
            </Text>
            <Text style={styles.statsData}>
              {this.state.myTotalCO2Saved} kg
            </Text>
            <Text style={{ textAlign: "center", color: "rgb(66, 109, 183)" }}>
              (0.36 kg CO2 per mile)
            </Text>
          </View>
          <View style={{ marginTop: 20 }}>
            <TouchableHighlight
              onPress={() =>
                this.goToWebsite("https://carbonfund.org/how-we-calculate/")
              }
              underlayColor="rgb(46, 128, 210)"
            >
              <Image
                style={{ height: 350, width: 350, borderRadius: 350 }}
                source={planetPic}
              />
            </TouchableHighlight>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  statsHeading: {
    fontSize: 35,
    fontWeight: "bold"
  },

  statsData: {
    fontSize: 25,
    textAlign: "center",
    fontStyle: "italic",
    color: "rgb(66, 109, 183)"
  }
});
