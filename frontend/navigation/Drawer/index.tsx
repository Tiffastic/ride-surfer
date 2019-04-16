import React from "react";
import { Image } from "react-native";
import { createDrawerNavigator } from "react-navigation";
import ProfileScreen from "../../screens/passenger/ProfileScreen";
import MyRidesScreen from "../../screens/passenger/MyRidesScreen";
import UserSettingsScreen from "../../screens/passenger/UserSettingsScreen";
import MyStatsScreen from "../../screens/passenger/MyStatsScreen";

import HomeScreen from "../../screens/passenger/HomeScreen";
import Icon from "react-native-vector-icons/Ionicons";
import Colors from "../../constants/Colors";
import {
  Styles,
  addStylesListener,
  clearStylesListener
} from "../../constants/Styles";
import { Text, ScrollView, StyleSheet } from "react-native";

const drawer = createDrawerNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        drawerLabel: (
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "left",
              paddingBottom: 20,
              paddingTop: 20,
              color: "white"
            }}
          >
            Home
          </Text>
        ),
        drawerIcon: <Icon name="ios-home" size={24} color="white" />
      }
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        drawerLabel: (
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "left",
              paddingBottom: 20,
              paddingTop: 20,
              color: "white"
            }}
          >
            Profile
          </Text>
        ),
        drawerIcon: <Icon name="ios-person" size={24} color="white" />
      }
    },
    MyRides: {
      screen: MyRidesScreen,
      navigationOptions: {
        drawerLabel: (
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "left",
              paddingBottom: 20,
              paddingTop: 20,
              color: "white"
            }}
          >
            My Ride
          </Text>
        ),
        drawerIcon: <Icon name="ios-car" size={24} color="white" />
      }
    },
    UserSettings: {
      screen: UserSettingsScreen,
      navigationOptions: {
        drawerLabel: (
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "left",
              paddingBottom: 20,
              paddingTop: 20,
              color: "white"
            }}
          >
            Settings
          </Text>
        ),
        drawerIcon: <Icon name="ios-settings" size={24} color="white" />
      }
    }
  },
  {
    drawerBackgroundColor: Colors.primary
  }
);
export default drawer;
