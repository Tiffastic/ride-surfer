import React from "react";
import { createStackNavigator } from "react-navigation";

import LoginScreen from "../screensAuth/LoginScreen";
import SignupScreen from "../screensAuth/SignupScreen";
import AuthLandingScreen from "../screensAuth/AuthLandingScreen";

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
