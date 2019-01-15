import * as React from "react";
import { createSwitchNavigator } from "react-navigation"; // ver 3 has and we need, createAppContainer
import AuthStack from "./AuthStack";
import HomeScreen from "../screens/HomeScreen";

export default createSwitchNavigator(
  {
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Auth: AuthStack,
    Main: HomeScreen
  },
  {
    initialRouteName: "Auth"
  }
);
