import React from "react";
import {
  View,
  Text,
  Platform,
  StyleSheet,
  Image,
  ScrollView,
  Linking,
  TouchableHighlight,
  ActivityIndicator
} from "react-native";

import { createStackNavigator } from "react-navigation";
import HeaderButtons, { HeaderButton } from "react-navigation-header-buttons";
import Colors from "../../constants/Colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import MyStatsYearChoiceScreen from "./MyStatsYearChoiceScreen";
import MyStatsMilesPerYearScreen from "./MyStatsMilesPerYear";
import MyStatsCO2PerYearScreen from "./MyStatsCO2PerYear";

import { fetchAPI } from "../../network/Backend";
import UserSession from "../../network/UserSession";
import StatsChart from "../../components/StatsChart";

//https://elpijimelon.files.wordpress.com/2015/04/planet-bumi-1.jpg
const planetPic = require("../../assets/images/planet.jpg");

class MyStatsScreen extends React.Component<{
  navigation: any;
}> {
  constructor(props: any) {
    super(props);
  }

  state = {
    myTotalRideSharingMiles: "X",
    myTotalCO2Saved: "Y",
    isLoadingOverallStats: true,
    meId: 0,
    milesPerYearChart: null,
    isLoadingMilesPerYearChart: true,
    co2PerYearChart: null,
    isLoadingCO2PerYearChart: true
  };

  componentDidMount() {
    this.bootstrap();
  }

  bootstrap = async () => {
    let userDetails = await UserSession.get();
    if (userDetails == null) return;

    this.setState({ meId: userDetails.id });

    this.getOverallStatsFromRideSharingMiles();

    this.getMilesPerYearData();
    this.getCO2PerYearData();
  };

  getOverallStatsFromRideSharingMiles() {
    fetchAPI(`/calculateStatsFromSurfMiles?meId=${this.state.meId}`).then(
      async response => {
        if (response.status === 200) {
          var responseJson = await response.json();

          this.setState({
            myTotalRideSharingMiles: responseJson.totalMiles,
            myTotalCO2Saved: responseJson.totalCO2,
            isLoadingOverallStats: false
          });
        } else {
          alert("Sorry, couldn't retrieve stats information");
        }
      }
    );
  }

  getMilesPerYearData() {
    fetchAPI(`/getMilesPerYearData?meId=${this.state.meId}`).then(
      async response => {
        if (response.status === 200) {
          var responseJson = await response.json();

          var data = responseJson.milesPerYear;
          var tickValuesXAxis: any = [];
          var tickFormatXAxis: any = [];
          var tickFormatYAxis: any = [];

          data.map((row: any, index: number) => {
            tickValuesXAxis.push(row.year);
            tickFormatXAxis.push(row.year.toString());

            var roundMiles = Math.round(row.miles);
            tickFormatYAxis.push(roundMiles);
          });

          var milesPerYearBarGraph = (
            <StatsChart
              tickValuesXAxis={tickValuesXAxis}
              tickFormatXAxis={tickFormatXAxis}
              tickFormatYAxis={tickFormatYAxis}
              style={{ data: { fill: "rgb(91, 125, 242)" } }}
              data={data}
              x="year"
              y="miles"
            />
          );

          this.setState({
            milesPerYearChart: milesPerYearBarGraph,
            isLoadingMilesPerYearChart: false
          });
        }
      }
    );
  }

  getCO2PerYearData() {
    fetchAPI(`/getCO2PerYearData?meId=${this.state.meId}`).then(
      async response => {
        if (response.status === 200) {
          var responseJson = await response.json();

          var data = responseJson.co2PerYear;
          var tickValuesXAxis: any = [];
          var tickFormatXAxis: any = [];
          var tickFormatYAxis: any = [];

          data.map((row: any, index: number) => {
            tickValuesXAxis.push(row.year);
            tickFormatXAxis.push(row.year.toString());

            var roundCo2 = Math.round(row.co2);
            tickFormatYAxis.push(roundCo2);
          });

          var co2PerYearBarGraph = (
            <StatsChart
              tickValuesXAxis={tickValuesXAxis}
              tickFormatXAxis={tickFormatXAxis}
              tickFormatYAxis={tickFormatYAxis}
              style={{ data: { fill: "rgb(18, 194, 196)" } }} //"rgb(18, 194, 36)"  // "rgb(15, 230, 198)"
              data={data}
              x="year"
              y="co2"
            />
          );

          this.setState({
            co2PerYearChart: co2PerYearBarGraph,
            isLoadingCO2PerYearChart: false
          });
        }
      }
    );
  }

  goToWebsite(url: string) {
    if (Platform.OS === "android") {
      Linking.openURL(url);
    } else {
      LinkingIOS.openURL("http://google.com");
    }
  }

  goToStatsYearChoiceScreen(statsChoice: string) {
    this.props.navigation.push("MyStatsYearChoice", {
      statsChoice: statsChoice
    });
  }

  render() {
    if (
      this.state.isLoadingOverallStats ||
      this.state.isLoadingMilesPerYearChart ||
      this.state.isLoadingCO2PerYearChart
    ) {
      return <ActivityIndicator />;
    }
    // after user click finish
    // store their ride sharing miles in a table: RideShareMiles
    // UserID, Miles
    // based on their miles, show their stats

    return (
      <ScrollView>
        <View style={{ alignItems: "center", marginBottom: 15 }}>
          <View>
            <Text style={styles.pageHeading}>My Ride-Surfing Stats</Text>
          </View>
          <View style={{ marginTop: 40 }}>
            <Text
              style={[styles.statsHeading, { color: "rgb(33, 120, 216)" }]} //
            >
              Ride-Surfing Miles
            </Text>

            <TouchableHighlight
              underlayColor="yellow"
              onPress={() => {
                this.goToStatsYearChoiceScreen("Ride-Surf Miles");
              }}
            >
              <Text style={[styles.statsData, styles.textLink]}>
                Total {this.state.myTotalRideSharingMiles} miles
              </Text>
            </TouchableHighlight>
          </View>

          <View>{this.state.milesPerYearChart}</View>

          <View style={{ marginTop: 30 }}>
            <Text
              style={[
                styles.statsHeading,
                { textAlign: "center", color: "rgb(13, 138, 145)" } //"rgb(15, 230, 198)""rgb(18, 194, 36)""rgb(14, 151, 158)"
              ]}
            >
              CO2 Savings
            </Text>

            <TouchableHighlight
              underlayColor="yellow"
              onPress={() => {
                this.goToStatsYearChoiceScreen("CO2");
              }}
            >
              <Text style={[styles.statsData, styles.textLink]}>
                Total {this.state.myTotalCO2Saved} kg
              </Text>
            </TouchableHighlight>

            <Text style={{ textAlign: "center", color: "rgb(66, 109, 183)" }}>
              (0.36 kg CO2 per mile)
            </Text>

            <View>{this.state.co2PerYearChart}</View>
          </View>
          <View style={{ marginTop: 20 }}>
            <TouchableHighlight
              onPress={() =>
                this.goToWebsite("https://carbonfund.org/how-we-calculate/")
              }
              underlayColor="rgb(46, 128, 210)"
            >
              <View>
                <Image
                  style={{ height: 350, width: 350, borderRadius: 350 }}
                  source={planetPic}
                />
                <Text style={[styles.textLink, { textAlign: "center" }]}>
                  Learn more about CO2 calculations
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const IoniconsHeaderButton = (passMeFurther: any) => (
  // the `passMeFurther` variable here contains props from <Item .../> as well as <HeaderButtons ... />
  // and it is important to pass those props to `HeaderButton`
  // then you may add some information like icon size or color (if you use icons)
  <HeaderButton
    {...passMeFurther}
    IconComponent={Ionicons}
    iconSize={40}
    color={Colors.primary}
    buttonStyle={{
      // backgroundColor: "rgba(92, 99,216, 1)",
      height: 60
      // textAlignVertical: 'center',

      // borderWidth: 0,
      // borderRadius: 5
    }}
  />
);
export default createStackNavigator(
  {
    //RouteConfigs
    MyStatsScreen: {
      screen: MyStatsScreen,
      navigationOptions: ({ navigation }: { navigation: any }) => ({
        headerLeft: (
          <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
            <HeaderButton
              title="ProfileIcon"
              iconName="ios-menu"
              onPress={() => navigation.openDrawer()}
            />
          </HeaderButtons>
        ),
        headerTitleStyle: {
          textAlign: "center",
          fontWeight: "bold",
          height: 45,
          flex: 1
        }
      })
    },
    MyStatsYearChoiceScreen: MyStatsYearChoiceScreen,
    MyStatsMilesPerYear: MyStatsMilesPerYearScreen,
    MyStatsCO2PerYear: MyStatsCO2PerYearScreen
  },
  {
    initialRouteName: "MyStatsScreen"
  }
);

const styles = StyleSheet.create({
  statsHeading: {
    fontSize: 31,
    fontWeight: "bold"
  },

  statsData: {
    fontSize: 25,
    textAlign: "center",
    fontStyle: "italic",
    color: "rgb(66, 109, 183)"
  },

  pageHeading: {
    marginTop: 15,
    fontSize: 34,
    fontStyle: "italic",
    textAlign: "center",
    color: "rgb(61, 84, 154)",
    fontWeight: "300"
  },

  textLink: {
    color: "blue",
    textDecorationLine: "underline"
  }
});
