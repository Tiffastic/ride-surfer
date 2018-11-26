import React from 'react';
import { createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthStack from './AuthStack';

let AppNavigator = createSwitchNavigator(
  {
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Auth: AuthStack,
    Main: MainTabNavigator,
  }, {
    initialRouteName: 'Main',
  }
);

AppNavigator.navigationOptions = {
  tabBarLabel: 'Messages',
};

export default AppNavigator;