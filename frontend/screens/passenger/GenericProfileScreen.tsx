import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableHighlight,
  Text,
  Image
} from "react-native";

import { fetchAPI } from "../../network/Backend";
import { Styles } from "../../constants/Styles";

export default class GenericProfileScreen extends React.Component<{
  navigation: any;
}> {
  static navigationOptions = ({ navigation }: any) => {
    return {
      headerTitle: "Profile"
    };
  };

  state = {
    user: this.props.navigation.getParam("user"),
    avgOverallRating: null as null | number,
    avgSafetyRating: null as null | number,
    avgTimelinessRating: null as null | number,
    avgCleanlinessRating: null as null | number,
    userPhoto: null
  };

  constructor(props: any) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    this.getUserPhoto();
    this.getRatings();
  };

  updateProfile() {}

  getAvgOverallRating() {
    fetchAPI("/usersOverallRating/" + this.state.user.id)
      .then(response => response.json())
      .then(response => {
        this.setState({ avgOverallRating: response.avgOverall });
      })
      .catch(error => {
        console.log(error);
      });
  }

  getAvgSafetyRating() {
    fetchAPI("/usersSafetyRating/" + this.state.user.id)
      .then(response => response.json())
      .then(response => this.setState({ avgSafetyRating: response.avgSafety }))
      .catch(error => {
        console.log(error);
      });
  }

  getAvgTimelinessRating() {
    fetchAPI("/usersTimelinessRating/" + this.state.user.id)
      .then(response => response.json())
      .then(response =>
        this.setState({ avgTimelinessRating: response.avgTimeliness })
      )
      .catch(error => {
        console.log(error);
      });
  }

  getAvgCleanlinessRating() {
    fetchAPI("/usersCleanlinessRating/" + this.state.user.id)
      .then(response => response.json())
      .then(response => {
        this.setState({ avgCleanlinessRating: response.avgCleanliness });
      })
      .catch(error => {
        console.log(error);
      });
  }

  getRatings() {
    this.getAvgOverallRating();
    this.getAvgSafetyRating();
    this.getAvgTimelinessRating();
    this.getAvgCleanlinessRating();
  }

  getUserPhoto() {
    fetchAPI("/getUserImage/" + this.state.user.id)
      .then(response => response.json())
      .then(response => {
        this.setState({ userPhoto: response.userImage });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    let name = this.state.user.firstName + " " + this.state.user.lastName;

    let round = (number: number) => Math.round(number * 10) / 10;

    return (
      <View style={styles.container}>
        <View style={{ flexDirection: "row" }}>
          <TouchableHighlight
            style={{
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.2)",
              alignItems: "center",
              justifyContent: "center",
              width: 150,
              height: 150,
              borderRadius: 75
            }}
          >
            <Image
              style={{ height: 150, width: 150, borderRadius: 75 }}
              resizeMode="center"
              source={
                this.state.userPhoto !== null
                  ? { uri: this.state.userPhoto }
                  : require("../../assets/images/default-profile.png")
              }
            />
          </TouchableHighlight>
        </View>
        <View style={{ flex: 2, alignItems: "center" }}>
          <Text style={{ fontSize: 34, margin: 10 }}>{name}</Text>
          <Text style={{ fontSize: 20 }}>{this.state.user.email}</Text>
          {this.state.user.vehicles &&
            this.state.user.vehicles[0] &&
            this.state.user.vehicles[0].year !== null &&
            this.state.user.vehicles[0].make !== null &&
            this.state.user.vehicles[0].model !== null &&
            this.state.user.vehicles[0].plate !== null && (
              <FlatList
                data={this.state.user.vehicles}
                extraData={this.state}
                keyExtractor={(item: any, index: any) => item.id}
                renderItem={({ item, separators }: any) => (
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <Text style={{ fontSize: 20 }}>
                      {item.year + " " + item.make + " " + item.model}
                    </Text>
                    <Text style={{ fontSize: 20 }}>{item.plate}</Text>
                  </View>
                )}
              />
            )}
        </View>

        <View style={{ flex: 1, alignItems: "center", margin: 10 }}>
          {this.state.avgOverallRating !== null && (
            <Text style={{ fontSize: 18 }}>
              Overall: {round(this.state.avgOverallRating)} ★
            </Text>
          )}
          {this.state.avgSafetyRating !== null && (
            <Text style={{ fontSize: 18 }}>
              Safety: {round(this.state.avgSafetyRating)} ★
            </Text>
          )}
          {this.state.avgTimelinessRating !== null && (
            <Text style={{ fontSize: 18 }}>
              Timeliness: {round(this.state.avgTimelinessRating)} ★
            </Text>
          )}
          {this.state.avgCleanlinessRating !== null && (
            <Text style={{ fontSize: 18 }}>
              Cleanliness: {round(this.state.avgCleanlinessRating)} ★
            </Text>
          )}
          {!this.state.avgOverallRating &&
            !this.state.avgSafetyRating &&
            !this.state.avgTimelinessRating &&
            !this.state.avgCleanlinessRating && (
              <Text style={{ fontSize: 18 }}>No ratings yet</Text>
            )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: "#fff",
    alignItems: "center"
  },
  tableRow: {
    flexDirection: "row"
  },
  uploadButton: {
    width: 256,
    height: 50,
    backgroundColor: "blue"
  }
});
