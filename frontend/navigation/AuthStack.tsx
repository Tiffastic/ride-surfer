import { createStackNavigator } from "react-navigation";

import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import SignupDriverScreen from "../screens/auth/SignupDriverScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";

import AuthLandingScreen from "../screens/auth/AuthLandingScreen";

export default createStackNavigator(
  {
    AuthLanding: AuthLandingScreen,
    Login: LoginScreen,
    Signup: SignupScreen,
    SignupDriver: SignupDriverScreen,
    ForgotPassword: ForgotPasswordScreen
  },
  {}
);
