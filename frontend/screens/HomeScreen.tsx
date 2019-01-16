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

import Colors from "../constants/Colors";
import HeaderButtons, { HeaderButton } from "react-navigation-header-buttons";
import Ionicons from "react-native-vector-icons/Ionicons";

import DriverPickerScreen from "./DriverPickerScreen";
import DriverDetailsScreen from "./DriverDetailsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MessageContactsScreen from "../screens/MessageContactsScreen";
import MessageConversationsScreen from "../screens/MessageConversationsScreen";
import RideInProgressScreen from "./RideInProgressScreen";
import RateDriverScreen from "./RateDriverScreen";

import { Permissions, Location } from "expo";
import MapView, { Marker } from "react-native-maps";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

type state = {
  isLoading: boolean;
  startLocationInput: string;
  startLocation: { latitude: number; longitude: number };
  destinationLocationInput: string;
  destinationLocation: { latitude: number; longitude: number };
  markers: Array<{ latitude: number; longitude: number }>;
  errorMessage: string;
};

class AddressPicker extends React.Component<{ navigation: any }, state> {
  constructor(props: any) {
    super(props);

    this.state = {
      isLoading: true,
      startLocationInput: "",
      startLocation: { latitude: LATITUDE, longitude: LONGITUDE },
      destinationLocationInput: "",
      destinationLocation: { latitude: LATITUDE, longitude: LONGITUDE },
      markers: [{ latitude: LATITUDE, longitude: LONGITUDE }],
      errorMessage: ""
    };

    this.onMapPress = this.onMapPress.bind(this);
  }

  onMapPress(e: any) {
    let coords = {
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude
    };
    this.setState({ destinationLocation: coords });
  }

  search = async () => {
    let { status } = await Permissions.getAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    } else {
      if (this.state.startLocationInput !== "Current Location") {
        Location.geocodeAsync(this.state.startLocationInput)
          .then(response => {
            if (response.length > 0) {
              let coords = {
                latitude: response[0].latitude,
                longitude: response[0].longitude
              };
              this.setState({ startLocation: coords });
            }
          })
          .then(() => {
            if (this.state.destinationLocationInput !== "Current Location") {
              Location.geocodeAsync(this.state.destinationLocationInput).then(
                response => {
                  if (response.length > 0) {
                    let coords = {
                      latitude: response[0].latitude,
                      longitude: response[0].longitude
                    };
                    this.setState({ destinationLocation: coords });
                  }
                }
              );
            }
          })
          .then(() => {
            this.fetchMarkerData();
          });
      }
    }
  };

  componentDidMount() {
    this.fetchMarkerData();
  }

  fetchMarkerData() {
    this.setState({
      markers: [this.state.startLocation, this.state.destinationLocation],
      isLoading: false
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: "row" }}>
          <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
            <HeaderButton
              title="MessagesIcon"
              iconName="ios-locate"
              iconSize={20}
              onPress={() =>
                navigator.geolocation.getCurrentPosition(
                  position => {
                    this.setState({
                      startLocation: position.coords,
                      startLocationInput: "Current Location"
                    });
                  },
                  error => Alert.alert(error.message),
                  { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
                )
              }
            />
          </HeaderButtons>
          <TextInput
            placeholder="Starting location?"
            style={styles.queryBox}
            value={this.state.startLocationInput}
            onChangeText={text => this.setState({ startLocationInput: text })}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
            <HeaderButton
              title="MessagesIcon"
              iconName="ios-locate"
              iconSize={20}
              onPress={() =>
                navigator.geolocation.getCurrentPosition(
                  position => {
                    this.setState({
                      destinationLocation: position.coords,
                      destinationLocationInput: "Current Location"
                    });
                  },
                  error => Alert.alert(error.message),
                  { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
                )
              }
            />
          </HeaderButtons>
          <TextInput
            placeholder="Where to?"
            style={styles.queryBox}
            value={this.state.destinationLocationInput}
            onChangeText={text =>
              this.setState({ destinationLocationInput: text })
            }
          />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View>
            <Button title="Search" onPress={this.search} />
          </View>
          <View>
            <Button
              title="Confirm"
              onPress={() =>
                this.props.navigation.push("DriverPicker", {
                  address: this.state.destinationLocation
                })
              }
            />
          </View>
        </View>
        <MapView
          style={{ flex: 1 }}
          provider="google"
          region={{
            latitude: this.state.destinationLocation.latitude,
            longitude: this.state.destinationLocation.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }}
          onPress={this.onMapPress}
        >
          {this.state.isLoading
            ? null
            : this.state.markers.map((marker, index) => {
                const coords = {
                  latitude: marker.latitude,
                  longitude: marker.longitude
                };
                return <Marker key={index} coordinate={coords} />;
              })}
        </MapView>
      </View>
    );
  }
} // end of address picker class

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

    AddressPicker: {
      screen: AddressPicker,
      navigationOptions: ({ navigation }: { navigation: any }) => ({
        title: `Ride Surfer`,
        headerRight: (
          <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
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
    RateDriver: RateDriverScreen
  },
  {
    //StackNavigatorConfig (Changes the bar itself and not the items inside it)

    initialRouteName: "AddressPicker",
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent"
  },
  queryBox: {
    borderColor: "#c3c3c3",
    backgroundColor: "white",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    fontSize: 36
  },
  searchResultsList: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "white"
  },
  searchResultsItem: {
    borderColor: "#c3c3c3",
    borderBottomWidth: 1
  },
  searchResultsName: {
    fontSize: 20
  },
  searchResultsAddress: {
    fontSize: 20,
    color: "grey"
  }
});
