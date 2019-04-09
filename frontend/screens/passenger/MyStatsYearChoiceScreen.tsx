import React from "react";
import { View, Text, ScrollView, Platform, StyleSheet } from "react-native";

import { fetchAPI } from "../../network/Backend";
import UserSession from "../../network/UserSession";

export default class MyStatsYearChoiceScreen extends React.Component<{
  navigation: any;
}> {
  state = {
    activeYears: [],
    statsYear: [],
    meId: 0,
    statsChoice: this.props.navigation.getParam("statsChoice")
  };

  constructor(props: any) {
    super(props);
  }

  componentDidMount() {
    this.bootstrap();
  }

  componentWillUnmount() {
    this.bootstrap();
  }

  bootstrap = async () => {
    let userDetails = await UserSession.get();
    if (userDetails == null) return;

    this.setState({ meId: userDetails.id });

    this.getMyActiveYears();
  };

  getMyActiveYears() {
    fetchAPI(`/getMyActiveYears?meId=${this.state.meId}`)
      .then(async response => {
        if (response.status === 200) {
          let responseJson = await response.json();

          const data = responseJson.activeYears;

          var textLink: any = [];

          data.map((row: any, index: number) => {
            textLink.push(
              <Text
                key={index.toString()}
                style={styles.textYear}
                onPress={() => this.navigateToSpecificStatsYear(row.year)}
              >
                {row.year}
              </Text>
            );
          });

          this.setState({ activeYears: textLink });
        } else {
          alert("Couldn't get active yeares");
        }
      })
      .catch(error => alert("Couldn't get stats:/n" + error));
  }

  navigateToSpecificStatsYear(year: number) {
    if (this.state.statsChoice === "Ride-Surf Miles") {
      this.props.navigation.push("MyStatsMilesPerYear", { year: year });
    } else if (this.state.statsChoice === "CO2") {
      this.props.navigation.push("MyStatsCO2PerYear", { year: year });
    }
  }

  render() {
    return (
      <ScrollView>
        <Text
          style={[
            styles.pageHeading,
            {
              color:
                this.state.statsChoice === "CO2"
                  ? "rgb(13, 138, 145)"
                  : "rgb(33, 120, 216)"
            }
          ]}
        >
          {this.state.statsChoice} By Year
        </Text>

        {this.state.activeYears}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  pageHeading: {
    fontSize: 30,
    //color: this.state.statsChoice === "CO2" ? "rgb(13, 138, 145)"  : "rgb(33, 120, 216)", //"rgb(61, 84, 154)",
    fontStyle: "italic",
    marginTop: 15,
    marginBottom: 20,
    textAlign: "center"
  },

  textYear: {
    color: "blue",
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
    textDecorationLine: "underline"
  }
});
