import React from "react";
import { createStackNavigator } from "react-navigation";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import AuthLandingScreen from "../screens/AuthLandingScreen";

export default createStackNavigator(
  {
    AuthLanding: AuthLandingScreen,
    Login: LoginScreen,
    Signup: SignupScreen
  },
  {
    headerMode: "none"
  }
);
