import React from "react";
import { createDrawerNavigator } from "react-navigation";
import ProfileScreen from "../../screens/passenger/ProfileScreen";
import MyRidesScreen from "../../screens/passenger/MyRidesScreen";
import UserSettingsScreen from "../../screens/passenger/UserSettingsScreen";

import HomeScreen from "../../screens/passenger/HomeScreen";
import Icon from "react-native-vector-icons/Ionicons";

export default createDrawerNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      drawerLabel: "Home",
      drawerIcon: ({ tintColor }) => <Icon name="ios-home" size={24} />
    }
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      drawerLabel: "Profile",
      drawerIcon: ({ tintColor }) => <Icon name="ios-person" size={24} />
    }
  },
  MyRides: {
    screen: MyRidesScreen,
    navigationOptions: {
      drawerLabel: "My Rides",
      drawerIcon: ({ tintColor }) => <Icon name="ios-car" size={24} />
    }
  },
  UserSettings: {
    screen: UserSettingsScreen,
    navigationOptions: {
      drawerLabel: "Settings",
      drawerIcon: ({ tintColor }) => <Icon name="ios-settings" size={24} />
    }
  }
});
