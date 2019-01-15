import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView
} from "react-native";

const picThuy = require("../assets/images/ThuyPic.png");
const picSmiley = require("../assets/images/cutesmiley.jpg");
const picShaggy = require("../assets/images/shaggy.jpg");
const picDaphne = require("../assets/images/daphne.jpg");
const picFred = require("../assets/images/fred.jpg");
const picVelma = require("../assets/images/velma.png");
const picScooby = require("../assets/images/scooby_doo.jpg");
const picStGermain = require("../assets/images/st_germain.png");

export default class MessageContactsScreen extends React.Component<{
  navigation: any;
}> {
  static navigationOptions = {
    title: "Contacts"
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <ScrollView>
          <TouchableHighlight
            style={styles.messageButton}
            underlayColor="orange"
            onPress={this._handleMessagePress}
          >
            <View style={styles.row}>
              <Image
                source={picThuy}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
              <View style={styles.imageHolder}>
                <Text style={styles.name}>Thuy</Text>
                <Text>Thanks for the ride!</Text>
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.messageButton}
            underlayColor="orange"
            onPress={this._handleMessagePress}
          >
            <View style={styles.row}>
              <Image
                source={picShaggy}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
              <View style={styles.imageHolder}>
                <Text style={styles.name}>Shaggy</Text>
                <Text>I'm standing at the corner of 500 E. 200 S.</Text>
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.messageButton}
            underlayColor="orange"
            onPress={this._handleMessagePress}
          >
            <View style={styles.row}>
              <Image
                source={picDaphne}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
              <View style={styles.imageHolder}>
                <Text style={styles.name}>Daphne</Text>
                <Text>I forgot something in your car, oops</Text>
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.messageButton}
            underlayColor="orange"
            onPress={this._handleMessagePress}
          >
            <View style={styles.row}>
              <Image
                source={picFred}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
              <View style={styles.imageHolder}>
                <Text style={styles.name}>Fred</Text>
                <Text>
                  I want to schedule a regular rideshare if that's okay with
                  you?
                </Text>
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.messageButton}
            underlayColor="orange"
            onPress={this._handleMessagePress}
          >
            <View style={styles.row}>
              <Image
                source={picVelma}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
              <View style={styles.imageHolder}>
                <Text style={styles.name}>Velma</Text>
                <Text>You're an awesome ride surfer, I've arrived safely</Text>
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.messageButton}
            underlayColor="orange"
            onPress={this._handleMessagePress}
          >
            <View style={styles.row}>
              <Image
                source={picScooby}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
              <View style={styles.imageHolder}>
                <Text style={styles.name}>Scooby-Doo</Text>
                <Text>Thank you! Hope to see you soon!</Text>
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.messageButton}
            underlayColor="orange"
            onPress={this._handleMessagePress}
          >
            <View style={styles.row}>
              <Image
                source={picStGermain}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
              <View style={styles.imageHolder}>
                <Text style={styles.name}>St. Germain</Text>
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.messageButton}
            underlayColor="orange"
            onPress={this._handleMessagePress}
          >
            <View style={styles.row}>
              <Image
                source={picSmiley}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
              <View style={styles.imageHolder}>
                <Text style={styles.name}>Ride Surfer</Text>
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.messageButton}
            underlayColor="orange"
            onPress={this._handleMessagePress}
          >
            <View style={styles.row}>
              <Image
                source={picSmiley}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
              <View style={styles.imageHolder}>
                <Text style={styles.name}>Ride Surfer</Text>
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.messageButton}
            underlayColor="orange"
            onPress={this._handleMessagePress}
          >
            <View style={styles.row}>
              <Image
                source={picSmiley}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
              <View style={styles.imageHolder}>
                <Text style={styles.name}>Ride Surfer</Text>
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.messageButton}
            underlayColor="orange"
            onPress={this._handleMessagePress}
          >
            <View style={styles.row}>
              <Image
                source={picSmiley}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
              <View style={styles.imageHolder}>
                <Text style={styles.name}>Ride Surfer</Text>
              </View>
            </View>
          </TouchableHighlight>
        </ScrollView>
      </View>
    );
  }

  _handlePress = () => {
    this.props.navigation.popToTop();
  };

  _handleMessagePress = () => {
    this.props.navigation.push("MessageConversations");
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(255, 255, 255)"
  },

  messageButton: {
    margin: 12,
    borderBottomColor: "rgba(206, 206, 206, 1)",
    borderBottomWidth: 1,
    alignSelf: "stretch",
    justifyContent: "center",
    padding: 10,
    paddingRight: 40,
    backgroundColor: "rgba(255, 255, 255, .8)"
  },

  row: {
    flexDirection: "row",
    alignItems: "center"
  },

  imageHolder: {
    marginLeft: 20
  },

  name: {
    fontSize: 33
  }
});
