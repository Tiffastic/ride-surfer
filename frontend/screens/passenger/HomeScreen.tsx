import * as React from "react";
import {
  FlatList,
  TextInput,
  TouchableHighlight,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  Button,
  View,
  Alert,
  Dimensions
} from "react-native";
import { createStackNavigator } from "react-navigation";

import Colors from "../../constants/Colors";
import HeaderButtons, { HeaderButton } from "react-navigation-header-buttons";
import Ionicons from "react-native-vector-icons/Ionicons";

import AddressPicker from "../../components/AddressPicker";

import DriverPickerScreen from "./DriverPickerScreen";
import DriverDetailsScreen from "./DriverDetailsScreen";
import ProfileScreen from "./ProfileScreen";
import MessageContactsScreen from "./MessageContactsScreen";
import MessageConversationsScreen from "./MessageConversationsScreen";
import StartRideScreen from "./StartRideScreen";
import RateDriverScreen from "./RateDriverScreen";
import RideInProgressScreen from "./RideInProgress";
import PushNotificationsRegisterScreen from "../auth/PushNotificationsRegisterScreen";

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

class HomeScreen extends React.Component<{ navigation: any }> {
  render() {
    return (
      <AddressPicker
        onConfirm={(origin, destination) => {
          this.props.navigation.push("DriverPicker", {
            origin: origin,
            destination: destination
          });
        }}
      />
    );
  }
}

export default createStackNavigator(
  {
    //RouteConfigs

    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }: { navigation: any }) => ({
        title: `Ride Surfer`,
        headerRight: (
          <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
            <HeaderButton
              title="OneDayASwitch"
              iconName="ios-cafe"
              onPress={() => navigation.navigate("DriverMain")}
            />
            <HeaderButton
              title="MessagesIcon"
              iconName="ios-chatbubbles"
              onPress={() => navigation.push("MessageContacts")}
            />
          </HeaderButtons>
        ),

        // headerLeft: (
        //   <View style={{ width: 90 }}>
        //     <Button
        //       onPress={() => navigation.push('ProfileScreen')}
        //       title="Profile"
        //       color={Colors.primary}
        //     />
        //   </View>
        // ),
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
    DriverPicker: DriverPickerScreen,
    DriverDetails: DriverDetailsScreen,
    MessageContacts: MessageContactsScreen,
    MessageConversations: MessageConversationsScreen,
    RideInProgress: RideInProgressScreen,
    RateDriver: RateDriverScreen,
    PushNotificationsRegister: PushNotificationsRegisterScreen
  },
  {
    //StackNavigatorConfig (Changes the bar itself and not the items inside it)

    initialRouteName: "HomeScreen",
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
