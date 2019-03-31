import * as React from "react";
import {
  TextInput,
  StyleSheet,
  Button,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Dimensions
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";
import Colors from "../constants/Colors";
import HeaderButtons, { HeaderButton } from "react-navigation-header-buttons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fetchAPI } from "../network/Backend";
import UserSession from "../network/UserSession";
import {
  Styles,
  addStylesListener,
  clearStylesListener
} from "../constants/Styles";

import { Permissions, Location } from "expo";
import MapView, { Marker, Polyline } from "react-native-maps";
import { geocodeAsync } from "expo-location";
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

  //mod block
  componentWillMount() {
    addStylesListener(this.onStylesChange);
  }

  componentWillUnmount() {
    clearStylesListener(this.onStylesChange);
  }

  private onStylesChange = () => this.forceUpdate();
  //or a hcak block above

  componentDidMount() {
    this.fetchCurrentLocation(position => {
      this.setState({
        startLocation: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        },
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
        this.getDrivingRoute();
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
      this.geocodeStartLocation().then(() =>
        this.geocodeDestinationLocation().then(() =>
          this.getDrivingRoute().then(() => {
            this.fetchMarkerData();
          })
        )
      );
    }
  };

  private setHomeOrWork(destinationLocationInput: string) {
    Alert.alert(
      "",
      "Would you like to save this address as a home or work address?",
      [
        {
          text: "No thanks",
          onPress: () => console.log("Ask me later pressed")
        },
        {
          text: "Home",
          onPress: async () => {
            var userDetails = await UserSession.get();
            if (userDetails === null) return;

            await fetchAPI("/users/" + userDetails.id, {
              method: "PUT",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                home: destinationLocationInput
              })
            }).then(response => {});
            userDetails.home = destinationLocationInput;
            await UserSession.set(userDetails);
          }
        },
        {
          text: "Work",
          onPress: async () => {
            var userDetails = await UserSession.get();
            if (userDetails === null) return;

            await fetchAPI("/users/" + userDetails.id, {
              method: "PUT",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                work: destinationLocationInput
              })
            }).then(response => {});
            userDetails.work = destinationLocationInput;
            await UserSession.set(userDetails);
          }
        }
      ],
      { cancelable: false }
    );
  }

  private geocodeStartLocation = async () => {
    if (this.state.startLocationInput !== "Current Location") {
      await Location.geocodeAsync(this.state.startLocationInput).then(
        response => {
          if (response.length > 0) {
            let coords = {
              latitude: response[0].latitude,
              longitude: response[0].longitude
            };
            this.setState({ startLocation: coords });
          }
        }
      );
    }
  };

  private geocodeDestinationLocation = async () => {
    if (this.state.destinationLocationInput !== "Current Location") {
      await Location.geocodeAsync(this.state.destinationLocationInput).then(
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

    //ask if they want to save this location?
    this.setHomeOrWork(this.state.destinationLocationInput);
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

  private async HomeWorkFavPress(type: string) {
    var userDetails = await UserSession.get();
    if (userDetails === null) return;

    if (type === "Home") {
      this.setState({ destinationLocationInput: userDetails.home });
    } else if (type === "Work") {
      this.setState({ destinationLocationInput: userDetails.work });
    }
    return;
  }

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
            style={Styles.queryBox}
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
            // autoComplete= "street-address"
            // textContentType="streetAddressLine1"
            style={Styles.queryBox}
            value={this.state.destinationLocationInput}
            onChangeText={text =>
              this.setState({ destinationLocationInput: text })
            }
            onSubmitEditing={this.search}
          />
          <Button title="Home" onPress={() => this.HomeWorkFavPress("Home")} />
          <Button title="Work" onPress={() => this.HomeWorkFavPress("Work")} />
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
          <View>
            <Button
              title="Arrival By Time?"
              onPress={() => this.setState({ isDateTimePickerVisible: true })}
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
                  this.state.destinationLocation,
                  this.state.arrivalAt
                );
              }}
            />
          </View>
        </View>
        <MapView
          style={{ flex: 1 }}
          provider="google"
          // region={region}
          onPress={this.onMapPress}
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
            />
          )}
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
    backgroundColor: "black"
  },
  queryBox: {
    borderColor: "#c3c3c3",
    backgroundColor: "white",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    fontSize: 24,
    width: width / 2.3,
    maxWidth: width / 2.3
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
