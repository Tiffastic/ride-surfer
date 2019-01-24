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

//import StarRating from "react-native-star-rating";
const StarRating = require("react-native-star-rating").default;

export default class RateDriverScreen extends React.Component<{
  navigation: any;
}> {
  static navigationOptions = {
    header: null
  };

  state = {
    driver: this.props.navigation.getParam("driver", {
      name: "Not Found",
      home: "",
      class: "",
      work: ""
    }),
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
      <ScrollView contentContainerStyle={[Styles.container, styles.container]}>
        <Text style={{ fontSize: 20, marginBottom: 20 }}>
          Thanks for riding with {this.state.driver.name}!
        </Text>

        <View style={{ marginBottom: 20 }}>
          <Image
            source={this.state.driver.profilePic}
            style={{ width: 200, height: 200, borderRadius: 100 }}
          />
        </View>

        <Text style={{ fontSize: 25, paddingBottom: 20 }}>Rate Your Ride</Text>

        <Text style={{ fontSize: 15, paddingBottom: 10 }}>Cleanliness</Text>
        <StarRating
          disabled={false}
          maxStars={5}
          fullStarColor={"gold"}
          starSize={45}
          rating={this.state.cleanlinessStar}
          selectedStar={(rating: number) => this.onCleanlinessStarPress(rating)}
        />

        <Text style={{ fontSize: 15, paddingBottom: 10 }}>Timeliness</Text>
        <StarRating
          disabled={false}
          maxStars={5}
          fullStarColor={"gold"}
          starSize={45}
          rating={this.state.timelinessStar}
          selectedStar={(rating: number) => this.onTimelinessStarPress(rating)}
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

        <View style={{ marginTop: 20, width: "80%" }}>
          <Button
            title="Rate"
            color={Colors.primary}
            onPress={this._submitRatings}
          />
        </View>
      </ScrollView>
    );
  }

  _submitRatings = () => {
    return fetch("http://ride-surfer.herokuapp.com/rateride", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        personRatingId: 1,
        personRatedId: 3,
        rideId: 3,
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
