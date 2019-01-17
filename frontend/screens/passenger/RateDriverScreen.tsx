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

// use `require` instead of `import` because there are no type definitions for this package
const Stars = require("react-native-stars").default;
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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
    })
  };

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

        <Text style={{ fontSize: 20, paddingBottom: 10 }}>Rate Your Ride</Text>

        <View>
          <Stars
            rating={2.5}
            count={5}
            half={true}
            fullStar={<Icon name={"star"} style={[styles.myStarStyle]} />}
            emptyStar={
              <Icon
                name={"star-outline"}
                style={[styles.myStarStyle, styles.myEmptyStarStyle]}
              />
            }
            halfStar={<Icon name={"star"} style={[styles.myStarStyle]} />}
          />
        </View>

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
          />
        </View>

        <View style={{ marginTop: 20, width: "80%" }}>
          <Button
            title="Rate"
            color={Colors.primary}
            onPress={this._handleHelpPress}
          />
        </View>
      </ScrollView>
    );
  }

  _handleHelpPress = () => {
    this.props.navigation.popToTop();
  };
}

const styles = StyleSheet.create({
  myStarStyle: {
    color: "yellow",
    backgroundColor: "transparent",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontSize: 50
  },

  myEmptyStarStyle: {
    color: "white"
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
