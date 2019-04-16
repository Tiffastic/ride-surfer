import * as React from "react";
import {
  TextInput,
  Button,
  View,
  Alert,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Text
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";
import Colors from "../constants/Colors";
import HeaderButtons, { HeaderButton } from "react-navigation-header-buttons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fetchAPI } from "../network/Backend";
import {
  Styles,
  addStylesListener,
  clearStylesListener
} from "../constants/Styles";

import { Permissions, Location } from "expo";
import MapView, { Marker, Polyline } from "react-native-maps";
import DateTimePicker from "react-native-modal-datetime-picker";

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
  drivingRoute: any;
  status: any;
  isDateTimePickerVisible: boolean;
  arrivalAt: Date;
};

export type Props = {
  onConfirm: (
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number },
    arrivalAt: Date
  ) => void;
  navigation: any;
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
      errorMessage: "",
      drivingRoute: [],
      status: "",
      isDateTimePickerVisible: false,
      arrivalAt: new Date()
    };
  }

  componentWillMount() {
    addStylesListener(this.onStylesChange);
  }
  componentWillUnmount() {
    clearStylesListener(this.onStylesChange);
  }
  private onStylesChange = () => {
    this.forceUpdate();
    this.props.navigation.setParams({});
  };
  componentDidMount() {
    this.fetchCurrentLocation(position => {
      this.setState({
        isLoading: false,
        startLocation: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
        startLocationInput: "Current Location"
      });
    });
  }

  private fetchCurrentLocation = (callback: (position: any) => void) => {
    navigator.geolocation.getCurrentPosition(
      callback,
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

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
        this.getDrivingRoute();
      }
    });
  };

  private getDrivingRoute = async () => {
    if (this.state.destinationLocation == null) {
      console.log("no dest");
      return;
    }
    await fetchAPI("/getDrivingRoute/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        destination: [
          this.state.destinationLocation.latitude,
          this.state.destinationLocation.longitude
        ],
        origin: [
          this.state.startLocation.latitude,
          this.state.startLocation.longitude
        ]
      })
    })
      .then(response => {
        this.setState({
          status: response.status
        });
        return response.json();
      })
      .then(responseJson => {
        if (this.state.status === 500) {
          console.log(responseJson.message);
        } else {
          this.setState({ drivingRoute: responseJson.coordinates });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  private getRegionForCoordinates(points: any) {
    // points should be an array of { latitude: X, longitude: Y }
    let minX: number, maxX: number, minY: number, maxY: number;

    // init first point
    (point => {
      minX = point.latitude;
      maxX = point.latitude;
      minY = point.longitude;
      maxY = point.longitude;
    })(points[0]);

    // calculate rect
    points.map((point: any) => {
      minX = Math.min(minX, point.latitude);
      maxX = Math.max(maxX, point.latitude);
      minY = Math.min(minY, point.longitude);
      maxY = Math.max(maxY, point.longitude);
    });

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    const deltaX = (maxX - minX) * 1.5;
    const deltaY = (maxY - minY) * 1.5;

    return {
      latitude: midX,
      longitude: midY,
      latitudeDelta: deltaX,
      longitudeDelta: deltaY
    };
  }

  googleMaps: any = [
    {
      elementType: "geometry",
      stylers: [
        {
          color: "#212121"
        }
      ]
    },
    {
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#757575"
        }
      ]
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#212121"
        }
      ]
    },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [
        {
          color: "#757575"
        }
      ]
    },
    {
      featureType: "administrative.country",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#9e9e9e"
        }
      ]
    },
    {
      featureType: "administrative.land_parcel",
      stylers: [
        {
          visibility: "off"
        }
      ]
    },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#bdbdbd"
        }
      ]
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#757575"
        }
      ]
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [
        {
          color: "#181818"
        }
      ]
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#616161"
        }
      ]
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#1b1b1b"
        }
      ]
    },
    {
      featureType: "road",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#2c2c2c"
        }
      ]
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#8a8a8a"
        }
      ]
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [
        {
          color: "#373737"
        }
      ]
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          color: "#3c3c3c"
        }
      ]
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry",
      stylers: [
        {
          color: "#4e4e4e"
        }
      ]
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#616161"
        }
      ]
    },
    {
      featureType: "transit",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#757575"
        }
      ]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000"
        }
      ]
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#3d3d3d"
        }
      ]
    }
  ];
  render() {
    let region = {
      latitude: this.state.startLocation.latitude,
      longitude: this.state.startLocation.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    };
    if (this.state.destinationLocation !== null) {
      region = this.getRegionForCoordinates([
        this.state.destinationLocation,
        this.state.startLocation
      ]);
    }
    return (
      <View style={Styles.container}>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            placeholder="Starting location?"
            onFocus={() =>
              this.props.navigation.push("AddressInput", {
                title: "Starting Location",
                onConfirm: (
                  location: string,
                  locationCoords: { latitude: number; longitude: number }
                ) => {
                  this.setState({
                    startLocationInput: location,
                    startLocation: locationCoords
                  });
                  this.getDrivingRoute();
                }
              })
            }
            style={Styles.queryBox}
            value={this.state.startLocationInput}
            // onChangeText={text => this.setState({ startLocationInput: text })}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            placeholder="Where to?"
            // autoComplete= "street-address"
            // textContentType="streetAddressLine1"
            onFocus={() =>
              this.props.navigation.push("AddressInput", {
                title: "Destination",

                withCurrentLocation: false, // who would ever want to go to their current location?
                onConfirm: (
                  location: string,
                  locationCoords: { latitude: number; longitude: number }
                ) => {
                  this.setState({
                    destinationLocationInput: location,
                    destinationLocation: locationCoords
                  });
                  this.getDrivingRoute();
                }
              })
            }
            style={Styles.queryBox}
            value={this.state.destinationLocationInput}
            // onChangeText={text =>
            //   this.setState({ destinationLocationInput: text })
            // }
            // onSubmitEditing={this.search}
          />
        </View>
        <DateTimePicker
          mode="datetime"
          date={this.state.arrivalAt}
          onConfirm={(time: Date) => {
            this.setState({ isDateTimePickerVisible: false });
            this.setState({ arrivalAt: time });
            // console.log("A date has been picked: ", time.toLocaleString());
          }}
          onCancel={() => {
            this.setState({ isDateTimePickerVisible: false });
          }}
          isVisible={this.state.isDateTimePickerVisible}
        />
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
          <View style={{ flexDirection: "row", marginLeft: 5 }}>
            <TouchableOpacity
              onPress={() => this.setState({ isDateTimePickerVisible: true })}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name="calendar" size={30} color={Colors.primary} />
                <Text style={{ marginLeft: 5 }}>
                  {this.state.arrivalAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric"
                  }) + " Arrival"}
                </Text>
              </View>
            </TouchableOpacity>
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
                  this.state.destinationLocation,
                  this.state.arrivalAt
                );
              }}
            />
          </View>
        </View>
        {this.state.isLoading ? (
          // an attempt to fix the map = 0 error
          <View style={{ flex: 1 }}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <MapView
            key={
              Styles.colorFlip.backgroundColor === Colors.darkBackground
                ? "dark"
                : "light"
            }
            style={{ flex: 1 }}
            provider="google"
            region={region} //this line relates to the map = 0 error
            onPress={this.onMapPress}
            customMapStyle={
              Styles.colorFlip.backgroundColor == Colors.darkBackground
                ? this.googleMaps
                : []
            }
          >
            <Marker coordinate={this.state.startLocation} />
            {this.state.destinationLocation !== null && (
              <Marker coordinate={this.state.destinationLocation}>
                <Icon name="flag" size={30} color="red" />
              </Marker>
            )}
            {this.state.drivingRoute && (
              <Polyline
                coordinates={this.state.drivingRoute.map((c: number[]) => ({
                  latitude: c[1],
                  longitude: c[0]
                }))}
                strokeWidth={2}
                strokeColor={
                  Styles.colorFlip.backgroundColor == Colors.darkBackground
                    ? "white"
                    : "black"
                }
              />
            )}
          </MapView>
        )}
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "black"
//   },
//   searchResultsList: {
//     marginTop: 10,
//     marginBottom: 10,
//     backgroundColor: "white"
//   },
//   searchResultsItem: {
//     borderColor: "#c3c3c3",
//     borderBottomWidth: 1
//   },
//   searchResultsName: {
//     fontSize: 20
//   },
//   searchResultsAddress: {
//     fontSize: 20,
//     color: "grey"
//   }
// });
