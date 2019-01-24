import React, { Component } from "react";
import {
  FlatList,
  TouchableHighlight,
  Image,
  StyleSheet,
  Text,
  Button,
  View
} from "react-native";

import Colors from "../../constants/Colors";
import { number, string } from "prop-types";

export default class DriverDetailsScreen extends React.Component<{
  navigation: any;
}> {
  state = {
    destination: this.props.navigation.getParam("destination", {
      description: string,
      latitude: number,
      longitude: number
    }),
    driver: this.props.navigation.getParam("driver", {
      name: "Home",
      home: "",
      class: "",
      work: ""
    })
  };

  render() {
    let image = this.state.driver.home;
    let dirs = this.state.driver.homeDirs;
    return (
      <View style={styles.container}>
        <Image
          style={{ flex: 1.25, width: undefined, height: undefined }}
          resizeMode="stretch"
          source={image}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 25, margin: 5 }}>
            {this.state.driver.name}
          </Text>

          <Text style={{ fontSize: 15, marginLeft: 5 }}>
            Directions to {this.state.destination.name}
          </Text>
          <FlatList
            data={dirs}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, separators }) => (
              <TouchableHighlight
                style={styles.searchResultsItem}
                onShowUnderlay={separators.highlight}
                onHideUnderlay={separators.unhighlight}
              >
                <View style={styles.flatview}>
                  <Text style={{ flex: 1 }}>{(item as any).time}</Text>
                  <Text style={{ flex: 2 }}>{(item as any).desc}</Text>
                </View>
              </TouchableHighlight>
            )}
          />
          <Button
            title="Request"
            onPress={this.onRequest}
            color={Colors.darkAccent}
          />
        </View>
      </View>
    );
  }

  onRequest = () => {
    this.props.navigation.navigate("RideInProgress", {
      destination: this.state.destination,
      driver: this.state.driver
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  flatview: {
    justifyContent: "center",
    paddingTop: 5,
    borderRadius: 2,
    flexDirection: "row",
    margin: 5
  },
  searchResultsList: {
    marginTop: 10,
    marginBottom: 10
  },
  searchResultsItem: {
    borderColor: "#c3c3c3",
    borderBottomWidth: 1
  }
});
