import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { fetchAPI } from "../../network/Backend";
import UserSession from "../../network/UserSession";
import StatsChart from "../../components/StatsChart";

export default class MyStatsCO2PerYear extends React.Component<{
  navigation: any;
}> {
  constructor(props: any) {
    super(props);
  }

  state = {
    year: this.props.navigation.getParam("year"),
    meId: 0,
    co2PerYearChart: null,
    isLoadingCO2PerMonthChart: true
  };

  componentDidMount() {
    this.bootstrap();
  }

  bootstrap = async () => {
    let userDetails = await UserSession.get();
    if (userDetails == null) return;

    this.setState({ meId: userDetails.id });

    this.getCO2PerMonthChart();
  };

  getCO2PerMonthChart() {
    fetchAPI(
      `/getCO2PerMonthData?meId=${this.state.meId}&year=${this.state.year}`
    ).then(async response => {
      if (response.status === 200) {
        const responseJson = await response.json();

        const data = responseJson.co2PerMonth;

        console.log("stats year details screen data = ", data);

        var tickValuesXAxis: any = [];
        var tickFormatXAxis: any = [];
        var tickFormatYAxis: any = [];

        data.map((row: any, index: number) => {
          tickValuesXAxis.push(row.month);
          tickFormatXAxis.push(row.month);

          var roundCO2 = Math.round(row.co2);
          tickFormatYAxis.push(roundCO2);
        });

        var co2PerMonthBarGraph = (
          <StatsChart
            tickValuesXAxis={tickValuesXAxis}
            tickFormatXAxis={tickFormatXAxis}
            tickFormatYAxis={tickFormatYAxis}
            style={{ data: { fill: "rgb(18, 194, 196)" } }}
            data={data}
            x="month"
            y="co2"
          />
        );

        this.setState({
          co2PerYearChart: co2PerMonthBarGraph,
          isLoadingCO2PerMonthChart: false
        });
      }
    });
  }

  render() {
    return (
      <View>
        <View>
          <Text style={styles.pageHeading}>
            CO2 for Year{"\n"}
            {this.state.year}
          </Text>

          <Text style={styles.subHeading}>kg per Month</Text>
        </View>
        {this.state.co2PerYearChart}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pageHeading: {
    marginTop: 15,
    fontSize: 30,
    textAlign: "center",
    color: "rgb(13, 138, 145)",
    fontWeight: "bold"
  },

  subHeading: {
    fontSize: 23,
    fontStyle: "italic",
    textAlign: "center",
    color: "rgb(54, 146, 190)"
  }
});
