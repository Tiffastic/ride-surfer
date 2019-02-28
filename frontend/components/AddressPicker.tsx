import * as React from "react";
import {
  TextInput,
  StyleSheet,
  Button,
  View,
  Alert,
  Dimensions
} from "react-native";
import { createStackNavigator } from "react-navigation";

import Colors from "../constants/Colors";
import HeaderButtons, { HeaderButton } from "react-navigation-header-buttons";
import Ionicons from "react-native-vector-icons/Ionicons";
// import ProfileScreen from "../screens/passenger/ProfileScreen";
// import MessageContactsScreen from "../passenger/MessageContactsScreen";
// import MessageConversationsScreen from "../passenger/MessageConversationsScreen";
// import PassengerPickerScreen from "./PassengerPickerScreen";

import { Permissions, Location } from "expo";
import MapView, { Marker } from "react-native-maps";
import { geocodeAsync } from "expo-location";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE = 40.7767833;
const LONGITUDE = -112.0605709;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export type state = {
  isLoading: boolean;
  startLocationInput: string;
  startLocation: { latitude: number; longitude: number };
  destinationLocationInput: string;
  destinationLocation: { latitude: number; longitude: number } | null;
  errorMessage: string;
};

export type Props = {
  onConfirm: (
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number }
  ) => void;
};

export default class AddressPicker extends React.Component<Props, state> {
  constructor(props: any) {
    super(props);

    this.state = {
      isLoading: true,
      startLocationInput: "",
      startLocation: { latitude: LATITUDE, longitude: LONGITUDE },
      destinationLocationInput: "",
      destinationLocation: null,
      errorMessage: ""
    };
  }

  componentDidMount() {
    this.fetchCurrentLocation(position => {
      this.setState({
        startLocation: position.coords,
        startLocationInput: "Current Location"
      });
      this.fetchMarkerData();
    });
  }

  onMapPress = (e: any) => {
    let coords = {
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude
    };
    Location.reverseGeocodeAsync(coords).then(response => {
      if (response.length > 0) {
        let address = response[0].name;
        if (response[0].street !== null) {
          address +=
            " " +
            response[0].street +
            " " +
            response[0].city +
            " " +
            response[0].region +
            " " +
            response[0].postalCode;
        }
        this.setState({
          destinationLocation: coords,
          destinationLocationInput: address
        });
      }
    });
  };

  search = async () => {
    let { status } = await Permissions.getAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    } else {
      await this.geocodeStartLocation();
      await this.geocodeDestinationLocation();
      this.fetchMarkerData();
    }
  };

  private geocodeStartLocation = async () => {
    if (this.state.startLocationInput !== "Current Location") {
      Location.geocodeAsync(this.state.startLocationInput).then(response => {
        if (response.length > 0) {
          let coords = {
            latitude: response[0].latitude,
            longitude: response[0].longitude
          };
          this.setState({ startLocation: coords });
        }
      });
    }
  };

  private geocodeDestinationLocation = async () => {
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
  };

  fetchMarkerData() {
    this.setState({
      isLoading: false
    });
  }

  private fetchCurrentLocation = (callback: (position: any) => void) => {
    navigator.geolocation.getCurrentPosition(
      callback,
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  private startAtCurrentLocation = async () => {
    this.fetchCurrentLocation(position => {
      this.setState({
        startLocation: position.coords,
        startLocationInput: "Current Location"
      });
    });
  };

  private endAtCurrentLocation = async () => {
    this.fetchCurrentLocation(position =>
      this.setState({
        destinationLocation: position.coords,
        destinationLocationInput: "Current Location"
      })
    );
  };

  render() {
    let mapCenter = this.state.destinationLocation;
    if (!mapCenter) {
      mapCenter = this.state.startLocation;
    }

    let markers = [
      {
        color: "green",
        latitude: this.state.startLocation.latitude,
        longitude: this.state.startLocation.longitude
      }
    ];
    if (this.state.destinationLocation !== null) {
      markers.push({
        color: "red",
        latitude: this.state.destinationLocation.latitude,
        longitude: this.state.destinationLocation.longitude
      });
    }
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: "row" }}>
          <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
            <HeaderButton
              title="MessagesIcon"
              iconName="ios-locate"
              iconSize={20}
              onPress={this.startAtCurrentLocation}
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
              onPress={this.endAtCurrentLocation}
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
        {/* TODO: add this back in */}
        {/* <View style={{ flexDirection: "row" }}>
          <TextInput
            placeholder="Arrive Time"
            style={styles.queryBox}
            value={this.state.destinationLocationInput}
            onChangeText={text =>
              this.setState({ destinationLocationInput: text })
            }
          />
        </View> */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginLeft: 5,
            marginTop: 5,
            marginRight: 5,
            marginBottom: 5
          }}
        >
          <View>
            <Button
              title="Search"
              onPress={this.search}
              color={Colors.primary}
            />
          </View>
          <View>
            <Button
              title="Confirm"
              disabled={this.state.destinationLocation === null}
              color={Colors.primary}
              onPress={() => {
                if (this.state.destinationLocation === null) {
                  return;
                }
                this.props.onConfirm(
                  this.state.startLocation,
                  this.state.destinationLocation
                );
              }}
            />
          </View>
        </View>
        <MapView
          style={{ flex: 1 }}
          provider="google"
          region={{
            latitude: mapCenter.latitude,
            longitude: mapCenter.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          }}
          onPress={this.onMapPress}
        >
          {markers.map((m, i) => (
            <Marker
              pinColor={m.color}
              coordinate={{
                latitude: m.latitude,
                longitude: m.longitude
              }}
            />
          ))}
        </MapView>
      </View>
    );
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
    fontSize: 24
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
