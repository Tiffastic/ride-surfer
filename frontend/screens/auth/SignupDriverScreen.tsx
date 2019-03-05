import React from "react";
import {
  TextInput,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  Platform,
  View,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert
} from "react-native";

import Colors from "../../constants/Colors";
import Styles from "../../constants/Styles";
import { fetchAPI } from "../../network/Backend";

import UserSession from "../../network/UserSession";
import { isLoaded } from "expo-font";

if (Platform.OS === "android") {
  var headerMode: any = null;
}

export default class SignupDriverScreen extends React.Component<{
  navigation: any;
}> {
  static navigationOptions = {
    header: headerMode
  };
  state = {
    car_make: null,
    car_model: null,
    car_year: null,
    car_plate: null
  };

  render() {
    return (
      <ScrollView style={[Styles.wrapper, Styles.container]}>
        <Text style={Styles.titleText}>Ride Surfer</Text>

        <Text style={Styles.paragraphText}>Add Driver Details</Text>

        <TextInput
          style={Styles.textInput}
          placeholder="License Plate"
          onChangeText={data => this.setState({ car_plate: data })}
        />

        <TextInput
          style={Styles.textInput}
          placeholder="Car Make"
          onChangeText={data => this.setState({ car_make: data })}
        />

        <TextInput
          style={Styles.textInput}
          placeholder="Car Model"
          onChangeText={data => this.setState({ car_model: data })}
        />

        <TextInput
          style={Styles.textInput}
          placeholder="Car Year"
          onChangeText={data => this.setState({ car_year: data })}
        />
        <Button
          color={Colors.primary}
          title="Done"
          onPress={this._saveAndGoBack}
        />
      </ScrollView>
    );
  }

  private _saveAndGoBack = () => {
    this.props.navigation.state.params.returnData(
      this.state.car_make,
      this.state.car_model,
      this.state.car_year,
      this.state.car_plate
    );
    this.props.navigation.goBack();
  };
}

const styles = StyleSheet.create({
  textInput: {
    borderColor: "#c3c3c3",
    backgroundColor: "white",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    fontSize: 36
  }
});
