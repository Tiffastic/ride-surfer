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

import NavigateButton from "../../components/NavigateButton";

import Colors from "../../constants/Colors";
import Styles from "../../constants/Styles";

export default class StartRideScreen extends React.Component<{
  navigation: any;
}> {
  state = {
    destination: this.props.navigation.getParam("destination", {
      description: "Not Found"
    }),
    driver: this.props.navigation.getParam("driver", {
      name: "Not Found",
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
            Directions to {this.state.destination.description}
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

          <View style={Styles.buttonView}>
            <Button
              title="Start"
              onPress={() =>
                this.props.navigation.navigate("RideInProgress", {
                  driver: this.state.driver,
                  destination: this.state.destination
                })
              }
              color={Colors.darkAccent}
            />
          </View>
        </View>
      </View>
    );
  }
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
