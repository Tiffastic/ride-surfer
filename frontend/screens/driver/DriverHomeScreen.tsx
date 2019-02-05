import * as React from "react";
import { View, Alert, ActivityIndicator } from "react-native";
import { createStackNavigator } from "react-navigation";

import HeaderButtons, { HeaderButton } from "react-navigation-header-buttons";
import Ionicons from "react-native-vector-icons/Ionicons";

import UserSession from "../../network/UserSession";
import { fetchAPI } from "../../network/Backend";

import Colors from "../../constants/Colors";
import ProfileScreen from "../passenger/ProfileScreen";
import MessageContactsScreen from "../passenger/MessageContactsScreen";
import MessageConversationsScreen from "../passenger/MessageConversationsScreen";
import PassengerPickerScreen from "./PassengerPickerScreen";
import AddressPicker from "../../components/AddressPicker";

class DriverHomeScreen extends React.Component<{ navigation: any }> {
  state = {
    isLoading: false
  };

  private onConfirm = async (
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number }
  ) => {
    this.setState({ isLoading: true });

    let userDetails = await UserSession.get();
    if (userDetails == null) return;

    fetchAPI("/journeys/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: userDetails.id,
        origin: [origin.latitude, origin.longitude],
        destination: [destination.latitude, destination.longitude],
        isDriver: true
      })
    })
      .then(async resp => {
        let json = await resp.json();
        if (!resp.ok) {
          throw json;
        }
        this.setState({ isLoading: false });
        Alert.alert("Your drive was confirmed");
        this.props.navigation.push("PassengerPicker", {
          origin: origin,
          address: destination
        });
      })
      .catch((error: any) => {
        Alert.alert("Error: couldn't save your trip");
        console.log(error);
        this.setState({ isLoading: false });
      });
  };

  render() {
    if (this.state.isLoading) {
      return <ActivityIndicator />;
    }
    return <AddressPicker onConfirm={this.onConfirm} />;
  }
}

const IoniconsHeaderButton = (passMeFurther: any) => (
  // the `passMeFurther` variable here contains props from <Item .../> as well as <HeaderButtons ... />
  // and it is important to pass those props to `HeaderButton`
  // then you may add some information like icon size or color (if you use icons)
  <HeaderButton
    {...passMeFurther}
    IconComponent={Ionicons}
    iconSize={40}
    color={Colors.primary}
    buttonStyle={{
      // backgroundColor: "rgba(92, 99,216, 1)",
      height: 60
      // textAlignVertical: 'center',

      // borderWidth: 0,
      // borderRadius: 5
    }}
  />
);

export default createStackNavigator(
  {
    //RouteConfigs
    DriverHomeScreen: {
      screen: DriverHomeScreen,
      navigationOptions: ({ navigation }: { navigation: any }) => ({
        title: `Driver Ride Surfer`,
        headerRight: (
          <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
            <HeaderButton
              title="OneDayASwithAlso"
              iconName="ios-cafe"
              onPress={() => navigation.navigate("Main")}
            />
            <HeaderButton
              title="MessagesIcon"
              iconName="ios-chatbubbles"
              onPress={() => navigation.push("MessageContacts")}
            />
          </HeaderButtons>
        ),
        headerLeft: (
          <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
            <HeaderButton
              title="ProfileIcon"
              iconName="ios-person"
              onPress={() => navigation.push("ProfileScreen")}
            />
          </HeaderButtons>
        ),
        headerTitleStyle: {
          textAlign: "center",
          fontWeight: "bold",
          height: 45,
          flex: 1
        }
      })
    },

    ProfileScreen: ProfileScreen,
    MessageContacts: MessageContactsScreen,
    MessageConversations: MessageConversationsScreen,
    PassengerPicker: PassengerPickerScreen
  },

  {
    //StackNavigatorConfig (Changes the bar itself and not the items inside it)
    initialRouteName: "DriverHomeScreen",
    // headerMode: 'none',
    navigationOptions: {
      //in react nav ver 3, this is called defaultNavigationOptions
      headerStyle: {
        backgroundColor: "white",
        height: 45
        // margin: 10, //this makes it clear what exactly StackNavigatorConfig is modifing.
      },
      headerTintColor: "black",
      headerTitleStyle: {
        // fontWeight: 'bold', //This however does change the title of the page and all sub pages.
      }
    }
  }
);
