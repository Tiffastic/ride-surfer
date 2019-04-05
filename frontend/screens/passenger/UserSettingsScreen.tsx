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
  TouchableHighlight
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import { Styles, setDark } from "../../constants/Styles";
import Colors from "../../constants/Colors";
import UserSession from "../../network/UserSession";
import RSIcon from "../../components/RSIcon";
import { fetchAPI } from "../../network/Backend";

if (Platform.OS === "android") {
  var headerMode: any = null; // the default headerMode is undefined, and for iOS, undefined shows header
}

export default class SettingsScreen extends React.Component<{
  navigation: any;
}> {
  static navigationOptions = {
    header: headerMode
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
    work: null as null | string
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

  render() {
    return (
      <KeyboardAvoidingView
        style={Styles.container}
        behavior="padding"
        keyboardVerticalOffset={22}
        enabled
      >
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
        <ScrollView style={[Styles.wrapper, Styles.container]} />
        <Button
          title="Dark Mode"
          onPress={() => {
            this.setState({});
            setDark(true);
          }}
        />
        <Button
          title="Light Mode"
          onPress={() => {
            this.setState({});
            setDark(false);
          }}
        />
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
      <Text>{props.name}</Text>
      {props.value === null ? (
        <ActivityIndicator />
      ) : (
        <TouchableHighlight onPress={props.onEdit}>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center"
            }}
          >
            <RSIcon title={props.name} name={props.icon} size={16} />
            {props.value === "" ? (
              <View style={{ flexDirection: "row" }}>
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
                <Icon name="pencil" size={30} color={Colors.darkAccent} />
              </View>
            )}
          </View>
        </TouchableHighlight>
      )}
    </View>
  );
}
