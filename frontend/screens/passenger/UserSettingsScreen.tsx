import React from "react";
import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  View,
  Button,
  Platform,
  ActivityIndicator,
  TouchableHighlight,
  Switch,
  ColorPropType
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import { Styles, setDark, getDark } from "../../constants/Styles";
import Colors from "../../constants/Colors";
import UserSession from "../../network/UserSession";
import RSIcon from "../../components/RSIcon";
import { fetchAPI } from "../../network/Backend";
import { registerForPushNotifications } from "../../network/PushNotificationRegister";

export default class SettingsScreen extends React.Component<{
  navigation: any;
}> {
  static navigationOptions = ({ navigation }: any) => {
    return {
      headerTitle: "Settings",
      headerRight: <View />,
      headerLeft: (
        <RSIcon
          title="Drawer"
          name="ios-menu"
          onPress={() => navigation.openDrawer()}
        />
      ),
      headerTitleStyle: {
        textAlign: "center",
        fontWeight: "bold",
        height: 45,
        flex: 1
      }
    };
  };

  constructor(props: any) {
    super(props);
  }

  componentWillMount() {
    this.loadUserHomeWork();
  }

  private loadUserHomeWork = async () => {
    let userDetails = await UserSession.get();
    if (userDetails === null) return;

    console.log(userDetails.home, userDetails.work);

    this.setState({
      home: userDetails.home === null ? "" : userDetails.home,
      work: userDetails.work === null ? "" : userDetails.work
    });
  };

  state = {
    home: null as null | string, // null when loading, empty string if unset
    work: null as null | string,
    isDarkMode: getDark()
  };

  private saveUserValue = async (data: any) => {
    var userDetails = await UserSession.get();
    if (userDetails === null) return;

    await fetchAPI("/users/" + userDetails.id, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(response => {});

    await UserSession.set({ ...userDetails, ...data });
  };

  private editHome = () => {
    this.props.navigation.push("AddressInput", {
      title: "Set Home",
      withWorkHome: false,
      onConfirm: async (location: string, locationCoords: any) => {
        this.setState({
          home: null
        });

        await this.saveUserValue({
          home: location
        });

        this.setState({
          home: location
        });
      }
    });
  };

  private editWork = () => {
    this.props.navigation.push("AddressInput", {
      title: "Set Work",
      withWorkHome: false,
      onConfirm: async (location: string, locationCoords: any) => {
        this.setState({
          work: null
        });

        await this.saveUserValue({
          work: location
        });

        this.setState({
          work: location
        });
      }
    });
  };

  _logOut = async () => {
    await UserSession.clear();
    this.props.navigation.navigate("Auth");
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={Styles.container}
        behavior="padding"
        keyboardVerticalOffset={22}
        enabled
      >
        <View style={{ margin: 10 }}>
          <Text style={Styles.heading}>Locations</Text>
          <PresetEditor
            icon="ios-home"
            name="Home"
            value={this.state.home}
            onEdit={this.editHome}
          />
          <PresetEditor
            icon="ios-briefcase"
            name="Work"
            value={this.state.work}
            onEdit={this.editWork}
          />

          <Text style={Styles.heading}>Experimental</Text>
          <View
            style={{ flexDirection: "row", alignItems: "center", margin: 10 }}
          >
            <Switch
              trackColor={{ true: Colors.primary, false: Colors.lightShades }}
              value={this.state.isDarkMode}
              onValueChange={value => {
                setDark(value);
                this.setState({ isDarkMode: value });
              }}
            />
            <Text style={{ marginLeft: 10 }}>Dark Mode</Text>
          </View>

          <View style={{ justifyContent: "flex-end" }}>
            <Text style={Styles.heading}>General</Text>
            <View style={{ margin: 15 }}>
              <Button
                title="Reset Push Notification"
                onPress={() => {
                  const registered = registerForPushNotifications();
                  if (registered) {
                    alert("Push Notification Registered");
                  } else {
                    alert("Error Registering for Push Notifications");
                  }
                }}
                color={Colors.primary}
              />
            </View>
            <Button
              title="Log Out"
              onPress={this._logOut}
              color={Colors.primary}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

function PresetEditor(props: {
  icon: string;
  name: string;
  value: null | string;
  onEdit: () => void;
}) {
  return (
    <View>
      <Text style={{ marginTop: 5, marginBottom: 5 }}>{props.name}</Text>
      {props.value === null ? (
        <ActivityIndicator />
      ) : (
        <TouchableHighlight onPress={props.onEdit}>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              margin: 5
            }}
          >
            <RSIcon title={props.name} name={props.icon} size={16} />
            {props.value === "" ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <RSIcon
                  color="grey"
                  title={"Add " + props.name}
                  name="ios-add"
                  size={16}
                />
                <Text style={{ color: "grey" }}>Add {props.name}</Text>
              </View>
            ) : (
              <View style={{ flexDirection: "row" }}>
                <Text>{props.value}</Text>
                <Icon
                  name="pencil"
                  size={25}
                  color={Colors.darkAccent}
                  style={{ marginLeft: 10 }}
                />
              </View>
            )}
          </View>
        </TouchableHighlight>
      )}
    </View>
  );
}
