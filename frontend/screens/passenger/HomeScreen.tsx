import * as React from "react";
import { Switch, Text, View, Alert } from "react-native";
import { createStackNavigator } from "react-navigation";

import Colors from "../../constants/Colors";
import HeaderButtons, { HeaderButton } from "react-navigation-header-buttons";
import Ionicons from "react-native-vector-icons/Ionicons";
import UserSession from "../../network/UserSession";
import { fetchAPI } from "../../network/Backend";
import AddressPicker from "../../components/AddressPicker";
import { Styles } from "../../constants/Styles";

import DriverPickerScreen from "./DriverPickerScreen";
import DriverDetailsScreen from "./DriverDetailsScreen";
import MessageContactsScreen from "./MessageContactsScreen";
import MessageConversationsScreen from "./MessageConversationsScreen";
import RateDriverScreen from "./RateDriverScreen";
import RideInProgressScreen from "./RideInProgress";
import GenericProfileScreen from "./GenericProfileScreen";
import MessageNewChatSearchScreen from "./MessageNewChatSearch";
import UserSettingsScreen from "../../screens/passenger/UserSettingsScreen";

const IoniconsHeaderButton = (passMeFurther: any) => (
  // the `passMeFurther` variable here contains props from <Item .../> as well as <HeaderButtons ... />
  // and it is important to pass those props to `HeaderButton`
  // then you may add some information like icon size or color (if you use icons)
  <HeaderButton
    {...passMeFurther}
    IconComponent={Ionicons}
    iconSize={40}
    color={Colors.primary}
    buttonStyle={
      {
        // backgroundColor: "rgba(92, 99,216, 1)",
        // height: 60
        // textAlignVertical: 'center',
        // borderWidth: 0,
        // borderRadius: 5
      }
    }
  />
);

class HomeScreen extends React.Component<{ navigation: any }> {
  static navigationOptions = {
    header: null
  };

  state = {
    mode: "Passenger" as "Passenger" | "Driver"
  };
  private passengerConfirm = (
    origin: any,
    destination: any,
    arrivalAt: Date
  ) => {
    this.props.navigation.push("DriverPicker", {
      origin: origin,
      destination: destination,
      arrivalAt: arrivalAt
    });
  };

  private driverConfirm = async (
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number },
    arrivalAt: Date
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
        arrivalAt: arrivalAt,
        isDriver: true
      })
    })
      .then(async resp => {
        let json = await resp.json();
        if (!resp.ok) {
          throw json;
        }
        this.setState({ isLoading: false });
        Alert.alert(
          "Your drive was confirmed!",
          "Go to the messages screen to view your ride requests."
        );
      })
      .catch((error: any) => {
        Alert.alert("Error: couldn't save your trip");
        console.log(error);
        this.setState({ isLoading: false });
      });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
            height: 60
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center"
            }}
          >
            <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
              <HeaderButton
                title="ProfileIcon"
                iconName="ios-menu"
                onPress={() => this.props.navigation.openDrawer()}
              />
            </HeaderButtons>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              flexGrow: 1,
              alignItems: "center"
            }}
          >
            <Switch
              trackColor={trackColors}
              value={this.state.mode === "Driver"}
              onValueChange={value =>
                this.setState({ mode: value ? "Driver" : "Passenger" })
              }
            />
            <Text style={{ marginLeft: 10, marginRight: 10, fontSize: 16 }}>
              {this.state.mode}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end"
            }}
          >
            <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
              <HeaderButton
                title="MessagesIcon"
                iconName="ios-chatbubbles"
                onPress={() => this.props.navigation.push("MessageContacts")}
              />
            </HeaderButtons>
          </View>
        </View>
        <AddressPicker
          onConfirm={
            this.state.mode === "Passenger"
              ? this.passengerConfirm
              : this.driverConfirm
          }
        />
      </View>
    );
  }
}
let trackColors = { true: Colors.primary, false: Colors.lightShades };

export default createStackNavigator(
  {
    //RouteConfigs
    HomeScreen: {
      screen: HomeScreen
    },
    DriverPicker: DriverPickerScreen,
    DriverDetails: DriverDetailsScreen,
    MessageContacts: MessageContactsScreen,
    MessageConversations: MessageConversationsScreen,
    RideInProgress: RideInProgressScreen,
    RateDriver: RateDriverScreen,
    GenericProfile: GenericProfileScreen,
    MessageNewChatSearch: MessageNewChatSearchScreen,
    UserSettings: UserSettingsScreen
  },
  {
    //StackNavigatorConfig (Changes the bar itself and not the items inside it)

    initialRouteName: "HomeScreen",
    // headerMode: 'none',
    navigationOptions: {
      //in react nav ver 3, this is called defaultNavigationOptions
      headerStyle: {
        backgroundColor: "white"
        // margin: 10, //this makes it clear what exactly StackNavigatorConfig is modifing.
      },
      headerTintColor: "black",
      headerTitleStyle: {
        // fontWeight: 'bold', //This however does change the title of the page and all sub pages.
      }
    }
  }
);
