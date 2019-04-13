import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator
} from "react-native";

import { fetchAPI } from "../../network/Backend";
import UserSession from "../../network/UserSession";
import StatsChart from "../../components/StatsChart";
import { number } from "prop-types";

export default class MyStatsMilesPerYear extends React.Component<{
  navigation: any;
}> {
  constructor(props: any) {
    super(props);
  }

  state = {
    year: this.props.navigation.getParam("year"),
    meId: 0,
    totalMilesPerYear: 0,
    milesPerYearChart: null,
    milesPerYearList: null,
    isLoadingMilesPerMonthChart: true
  };

  componentDidMount() {
    this.bootstrap();
  }

  bootstrap = async () => {
    let userDetails = await UserSession.get();
    if (userDetails == null) return;

    this.setState({ meId: userDetails.id });

    this.getMilesPerMonthData();
  };

  getMilesPerMonthData() {
    fetchAPI(
      `/getMilesPerMonthData?meId=${this.state.meId}&year=${this.state.year}`
    ).then(async response => {
      if (response.status === 200) {
        const responseJson = await response.json();

        const data = responseJson.milesPerMonth;

        var tickValuesXAxis: any = [];
        var tickFormatXAxis: any = [];
        var tickFormatYAxis: any = [];

        var milesPerYearText: any = [];

        var totalMilesPerYear = 0;

        data.map((row: any, index: number) => {
          tickValuesXAxis.push(row.month);
          tickFormatXAxis.push(row.month);

          totalMilesPerYear += row.miles;

          var roundMiles = Math.round(row.miles * 100) / 100;
          tickFormatYAxis.push(roundMiles);

          var pluralMiles = roundMiles > 1 ? "miles" : "mile";
          milesPerYearText.push(
            <Text
              key={index.toString()}
              style={{ fontWeight: "bold", color: "rgb(66, 109, 183)" }}
            >
              {row.month}:{" "}
              <Text style={{ fontWeight: "normal" }}>
                {roundMiles} {pluralMiles}
              </Text>
            </Text>
          );
        });

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

        totalMilesPerYear = Math.round(totalMilesPerYear * 100) / 100;
        this.setState({
          totalMilesPerYear: totalMilesPerYear,
          milesPerYearChart: milesPerMonthBarGraph,
          milesPerYearList: milesPerYearText,
          isLoadingMilesPerMonthChart: false
        });
      }
    });
  }

  render() {
    if (this.state.isLoadingMilesPerMonthChart) {
      return <ActivityIndicator />;
    }
    return (
      <ScrollView>
        <View>
          <Text style={styles.pageHeading}>
            Ride-Surf Miles for Year{"\n"}
            {this.state.year}
          </Text>

          <Text style={styles.subHeading}>Miles per Month</Text>
        </View>

        <View>{this.state.milesPerYearChart}</View>
        <View style={{ marginBottom: 15 }}>
          <Text style={styles.totalMiles}>
            Total {this.state.totalMilesPerYear}{" "}
            {this.state.totalMilesPerYear > 1 ? "miles" : "mile"}!
          </Text>
        </View>
        <View style={{ marginLeft: 55 }}>{this.state.milesPerYearList}</View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  pageHeading: {
    marginTop: 15,
    fontSize: 30,
    textAlign: "center",
    color: "rgb(33, 120, 216)",
    fontWeight: "bold"
  },

  subHeading: {
    fontSize: 23,
    fontStyle: "italic",
    textAlign: "center",
    color: "rgb(66, 109, 183)"
  },

  totalMiles: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "500",
    fontStyle: "italic",
    color: "rgb(33, 120, 216)" //"rgb(91, 125, 242)"
  }
});
