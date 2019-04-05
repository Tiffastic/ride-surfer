import * as React from "react";
import {
  TextInput,
  StyleSheet,
  Button,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Dimensions,
  FlatList,
  TouchableHighlight,
  ActivityIndicator
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";
import Colors from "../../constants/Colors";
import HeaderButtons, { HeaderButton } from "react-navigation-header-buttons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fetchAPI } from "../../network/Backend";
import UserSession from "../../network/UserSession";
import {
  Styles,
  addStylesListener,
  clearStylesListener
} from "../../constants/Styles";

import { Permissions, Location } from "expo";
import { geocodeAsync } from "expo-location";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE = 40.7767833;
const LONGITUDE = -112.0605709;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export type state = {
  isLoading: boolean;
  locationInput: string;
  location: { latitude: number; longitude: number };
  failedSearch: boolean;
  userHome: string;
  userWork: string;
  errorMessage: string;
};

export type Props = {
  onConfirm: (
    locationInput: string,
    location: { latitude: number; longitude: number }
  ) => void;
  navigation: any;
};

export default class AddressInputScreen extends React.Component<Props, state> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: false,
      locationInput: "",
      location: { latitude: LATITUDE, longitude: LONGITUDE },
      failedSearch: false,
      userHome: "",
      userWork: "",
      errorMessage: ""
    };
  }

  onConfirm = this.props.navigation.getParam("onConfirm");
  withCurrentLocation = this.props.navigation.getParam(
    "withCurrentLocation",
    true
  );
  withWorkHome = this.props.navigation.getParam("withWorkHome", true);

  componentWillMount() {
    addStylesListener(this.onStylesChange);

    this.loadUserHomeWork();
  }
  componentWillUnmount() {
    clearStylesListener(this.onStylesChange);
  }
  private onStylesChange = () => this.forceUpdate();

  componentDidMount() {
    // this.fetchCurrentLocation(position => {
    //   this.setState({
    //     startLocation: {
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.longitude
    //     },
    //     startLocationInput: "Current Location"
    //   });
    //   this.fetchMarkerData();
    // });
  }

  search = async (searchString: string) => {
    let { status } = await Permissions.getAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    } else {
      this.setState({ isLoading: true, failedSearch: false });
      this.geocodeLocationInput(searchString).then(() =>
        this.setState({ isLoading: false })
      );
    }
  };

  private geocodeLocationInput = async (searchString: string) => {
    if (searchString !== "Current Location") {
      await Location.geocodeAsync(searchString).then(response => {
        if (response.length > 0) {
          let coords = {
            latitude: response[0].latitude,
            longitude: response[0].longitude
          };
          this.setState({ location: coords });
          this.onConfirm(searchString, coords);
          this.props.navigation.goBack();
        } else {
          this.setState({ failedSearch: true });
        }
      });
    }
  };

  private fetchCurrentLocation = (callback: (position: any) => void) => {
    navigator.geolocation.getCurrentPosition(
      callback,
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  private useCurrentLocation = async () => {
    this.setState({ isLoading: true });
    this.fetchCurrentLocation(position => {
      this.setState({
        location: position.coords,
        locationInput: "Current Location",
        isLoading: false
      });
      this.onConfirm("Current Location", position.coords);
      this.props.navigation.goBack();
    });
  };

  private useWorkLocation = async () => {
    this.setState({
      locationInput: this.state.userWork
    });
    this.search(this.state.userWork);
  };

  private useHomeLocation = async () => {
    this.setState({
      locationInput: this.state.userHome
    });
    this.search(this.state.userHome);
  };

  private loadUserHomeWork = async () => {
    var userDetails = await UserSession.get();
    if (userDetails === null) return;

    if (userDetails.home) {
      this.setState({ userHome: userDetails.home });
    }
    if (userDetails.work) {
      this.setState({ userWork: userDetails.work });
    }
  };

  render() {
    let listItems: {
      key?: string;
      icon: string;
      name: string;
      onPress: () => void;
    }[] = [];

    if (this.state.locationInput !== "") {
      listItems.push({
        icon: "ios-search",
        name: "Search for " + this.state.locationInput,
        onPress: () => this.search(this.state.locationInput)
      });
    }

    if (this.withCurrentLocation) {
      listItems.push({
        icon: "ios-locate",
        name: "Current Location",
        onPress: this.useCurrentLocation
      });
    }

    if (this.state.userHome !== "") {
      listItems.push({
        icon: "ios-home",
        name: "Home: " + this.state.userHome,
        onPress: this.useHomeLocation
      });
    }

    if (this.state.userWork !== "") {
      listItems.push({
        icon: "ios-briefcase",
        name: "Work: " + this.state.userWork,
        onPress: this.useWorkLocation
      });
    }

    listItems.forEach((e, i) => (e.key = i.toString()));

    return (
      <View style={Styles.container}>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            editable={!this.state.isLoading}
            placeholder="Where to?"
            autoFocus={true}
            // autoComplete= "street-address"
            // textContentType="streetAddressLine1"
            style={Styles.queryBox}
            value={this.state.locationInput}
            onChangeText={text => this.setState({ locationInput: text })}
            // onSubmitEditing={this.search}
          />
        </View>
        <View>
          {this.state.failedSearch && (
            <Text>Couldn't find "{this.state.locationInput}"</Text>
          )}
        </View>
        {/* <View
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
              title="Confirm"
              disabled={this.state.locationInput === null}
              color={Colors.primary}
              onPress={() => {
                if (this.state.location === null) {
                  return;
                }
                this.props.onConfirm(
                  this.state.locationInput,
                  this.state.location
                );
              }}
            />
          </View>
        </View> */}
        <View>
          {this.state.isLoading ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <FlatList
              data={listItems}
              renderItem={({ item, separators }) => (
                <TouchableHighlight
                  style={{ borderColor: "#c3c3c3", borderBottomWidth: 1 }}
                  onPress={item.onPress}
                  onShowUnderlay={separators.highlight}
                  onHideUnderlay={separators.unhighlight}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      alignContent: "center",
                      marginLeft: 5,
                      marginTop: 5,
                      marginRight: 5,
                      marginBottom: 5
                    }}
                  >
                    {item.icon !== undefined && (
                      <View style={{ width: 60, justifyContent: "center" }}>
                        <HeaderButtons
                          HeaderButtonComponent={IoniconsHeaderButton}
                        >
                          <HeaderButton
                            title={item.name}
                            iconName={item.icon}
                            iconSize={16}
                          />
                        </HeaderButtons>
                      </View>
                    )}
                    <Text style={{ fontSize: 16 }}>{item.name}</Text>
                  </View>
                </TouchableHighlight>
              )}
            />
          )}
        </View>
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
