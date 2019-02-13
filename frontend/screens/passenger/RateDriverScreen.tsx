import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ScrollView
} from "react-native";

import Styles from "../../constants/Styles";
import Colors from "../../constants/Colors";

import { fetchAPI } from "../../network/Backend";
import UserSession from "../../network/UserSession";

const StarRating = require("react-native-star-rating").default;

export default class RateDriverScreen extends React.Component<{
  navigation: any;
}> {
  static navigationOptions = {
    header: null
  };

  state = {
    ridePartner: this.props.navigation.getParam("ridePartner"),
    rideDetails: this.props.navigation.getParam("rideDetails"),
    cleanlinessStar: 5,
    timelinessStar: 5,
    safetyStar: 5,
    overallStar: 5,
    rideComments: ""
  };

  onCleanlinessStarPress(rating: number) {
    this.setState({
      cleanlinessStar: rating
    });
  }

  onTimelinessStarPress(rating: number) {
    this.setState({
      timelinessStar: rating
    });
  }

  onSafetyStarPress(rating: number) {
    this.setState({
      safetyStar: rating
    });
  }

  onOverallStarPress(rating: number) {
    this.setState({
      overallStar: rating
    });
  }

  onUpdateComments(comments: string) {
    this.setState({
      rideComments: comments
    });
  }

  render() {
    return (
      <View style={[Styles.container, styles.container]}>
        <Text style={{ fontSize: 20, marginBottom: 20 }}>
          Thanks for riding with {this.state.ridePartner.name}!
        </Text>

        <View style={{ marginBottom: 20 }}>
          <Image
            source={this.state.ridePartner.profilePic}
            style={{ width: 200, height: 200, borderRadius: 100 }}
          />
        </View>

        <Text style={{ fontSize: 25, paddingBottom: 20 }}>Rate Your Ride</Text>

        <ScrollView>
          <Text style={{ fontSize: 15, paddingBottom: 10 }}>Cleanliness</Text>
          <StarRating
            disabled={false}
            maxStars={5}
            fullStarColor={"gold"}
            starSize={45}
            rating={this.state.cleanlinessStar}
            selectedStar={(rating: number) =>
              this.onCleanlinessStarPress(rating)
            }
          />

          <Text style={{ fontSize: 15, paddingBottom: 10 }}>Timeliness</Text>
          <StarRating
            disabled={false}
            maxStars={5}
            fullStarColor={"gold"}
            starSize={45}
            rating={this.state.timelinessStar}
            selectedStar={(rating: number) =>
              this.onTimelinessStarPress(rating)
            }
          />

          <Text style={{ fontSize: 15, paddingBottom: 10 }}>Safety</Text>
          <StarRating
            disabled={false}
            maxStars={5}
            fullStarColor={"gold"}
            starSize={45}
            rating={this.state.safetyStar}
            selectedStar={(rating: number) => this.onSafetyStarPress(rating)}
          />

          <Text style={{ fontSize: 15, paddingBottom: 10 }}>Overall</Text>
          <StarRating
            disabled={false}
            maxStars={5}
            fullStarColor={"gold"}
            starSize={45}
            rating={this.state.overallStar}
            selectedStar={(rating: number) => this.onOverallStarPress(rating)}
          />

          <View style={{ marginTop: 25 }}>
            <TextInput
              placeholder="Comments..."
              multiline={true}
              numberOfLines={5}
              style={{
                height: 80,
                width: 300,
                borderColor: "gray",
                borderWidth: 2,
                paddingHorizontal: 10,
                backgroundColor: "white"
              }}
              onChangeText={text => this.onUpdateComments(text)}
            />
          </View>

          <View
            style={{
              margin: 30,
              width: "80%",
              alignContent: "center"
            }}
          >
            <Button
              title="Rate"
              color={Colors.primary}
              onPress={this._submitRatings}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  _submitRatings = async () => {
    let userDetails = await UserSession.get();
    if (userDetails == null) return;

    return fetchAPI("/rateride", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        personRatingId: userDetails.id,
        personRatedId: this.state.ridePartner.id,
        rideId: this.state.rideDetails.id,
        cleanliness: this.state.cleanlinessStar,
        timeliness: this.state.timelinessStar,
        safety: this.state.safetyStar,
        overall: this.state.overallStar,
        comments: this.state.rideComments
      })
    })
      .then(response => console.log(response))
      .then(this.props.navigation.popToTop())
      .catch(error => {
        console.log(error);
      });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
