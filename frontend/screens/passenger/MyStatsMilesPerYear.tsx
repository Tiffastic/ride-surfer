import React from "react";
import { View, Text, Platform, StyleSheet } from "react-native";

import { createStackNavigator } from "react-navigation";
import HeaderButtons, { HeaderButton } from "react-navigation-header-buttons";
import MyStatsYearChoiceScreen from "./MyStatsYearChoiceScreen";
import Colors from "../../constants/Colors";
import Ionicons from "react-native-vector-icons/Ionicons";

import { fetchAPI } from "../../network/Backend";
import UserSession from "../../network/UserSession";
import StatsChart from "../../components/StatsChart";

export default class MyStatsMilesPerYear extends React.Component<{
  navigation: any;
}> {
  state = {
    meId: 0,
    year: this.props.navigation.getParam("year"),
    milesPerMonthChart: null,
    isLoadingMilesPerMonthChart: true
  };

  componentDidMount() {
    this.bootstrap();
  }

  bootstrap = async () => {
    let userDetails = await UserSession.get();
    if (userDetails == null) return;

    this.setState({ meId: userDetails.id });

    this.getMilesPerMonthChart();
  };

  getMilesPerMonthChart() {
    fetchAPI(
      `/getMilesPerMonthData?meId=${this.state.meId}&year=${this.state.year}`
    ).then(async response => {
      if (response.status === 200) {
        const responseJson = await response.json();

        const data = responseJson.milesPerMonth;

        var tickValuesXAxis: any = [];
        var tickFormatXAxis: any = [];
        var tickFormatYAxis: any = [];

        data.map((row: any, index: number) => {
          tickValuesXAxis.push(row.month);
          tickFormatXAxis.push(row.month);

          var roundMiles = Math.round(row.miles);
          tickFormatYAxis.push(roundMiles);
        });

        console.log("data = ", data);
        console.log("tickValuesXAxis = ", tickValuesXAxis);
        console.log("tickFormatXAxis = ", tickFormatXAxis);
        console.log("tickFormatYAxis = ", tickFormatYAxis);

        var milesPerMonthBarGraph = (
          <StatsChart
            tickValuesXAxis={tickValuesXAxis}
            tickFormatXAxis={tickFormatXAxis}
            tickFormatYAxis={tickFormatYAxis}
            style={{ data: { fill: "rgb(91, 125, 242)" } }}
            data={data}
            x="month"
            y="miles"
          />
        );

        this.setState({
          milesPerMonthChart: milesPerMonthBarGraph,
          isLoadingMilesPerMonthChart: false
        });
      }
    });
  }

  render() {
    return (
      <View>
        <View>
          <Text style={styles.pageHeading}>
            Ride-Surf Miles for Year{"\n"}
            {this.state.year}
          </Text>

          <Text style={styles.subHeading}>Miles per Month</Text>
        </View>

        {this.state.milesPerMonthChart}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pageHeading: {
    marginTop: 15,
    fontSize: 30,
    textAlign: "center",
    color: "rgb(33, 120, 216)", //"rgb(61, 84, 154)",
    fontWeight: "bold"
  },

  subHeading: {
    fontSize: 23,
    fontStyle: "italic",
    textAlign: "center",
    color: "rgb(54, 146, 190)"
  }
});
