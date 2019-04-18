import React from "react";
import {
  Text,
  KeyboardAvoidingView,
  View,
  Button,
  ActivityIndicator,
  TouchableHighlight,
  Switch
} from "react-native";
import { createStackNavigator } from "react-navigation";
import Icon from "react-native-vector-icons/FontAwesome";
import { Styles, setDark, isDark } from "../../constants/Styles";
import Colors from "../../constants/Colors";
import UserSession from "../../network/UserSession";
import RSIcon from "../../components/RSIcon";
import { fetchAPI } from "../../network/Backend";
import { registerForPushNotifications } from "../../network/PushNotificationRegister";
import AddressInputScreen from "./AddressInputScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import HeaderButtons, { HeaderButton } from "react-navigation-header-buttons";

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

class SettingsScreen extends React.Component<{
  navigation: any;
}> {
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
    isDarkMode: isDark()
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
    this.props.navigation.push("AddressInputPresets", {
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
    this.props.navigation.push("AddressInputPresets", {
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
                this.props.navigation.setParams({});
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

export default createStackNavigator(
  {
    //RouteConfigs
    SettingsScreen: {
      screen: SettingsScreen,
      navigationOptions: ({ navigation }: { navigation: any }) => ({
        headerTitle: "Settings",
        headerRight: <Text />,
        headerLeft: (
          <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
            <HeaderButton
              title="ProfileIcon"
              iconName="ios-menu"
              onPress={() => navigation.openDrawer()}
            />
          </HeaderButtons>
        ),
        headerStyle: {
          backgroundColor:
            Styles.colorFlip.backgroundColor === Colors.darkBackground
              ? Colors.darkBackground
              : Colors.lightBackground
        },
        headerTitleStyle: {
          textAlign: "center",
          fontWeight: "bold",
          flex: 1,
          color:
            Styles.colorFlip.backgroundColor === Colors.darkBackground
              ? Colors.darkText
              : Colors.lightText,
          height: 45
        },
        headerTintColor:
          Styles.colorFlip.backgroundColor === Colors.darkBackground
            ? Colors.darkText
            : Colors.lightText
      })
    },
    AddressInputPresets: AddressInputScreen
  },
  {
    initialRouteName: "SettingsScreen"
  }
);

function PresetEditor(props: {
  icon: string;
  name: string;
  value: null | string;
  onEdit: () => void;
}) {
  return (
    <View>
      <Text style={[{ marginTop: 5, marginBottom: 5 }, Styles.colorFlip]}>
        {props.name}
      </Text>
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
                <Text style={Styles.colorFlip}>{props.value}</Text>
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
