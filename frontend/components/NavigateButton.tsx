import React from "react";
import { Button, Linking, View } from "react-native";

import Colors from "../constants/Colors";
import Styles from "../constants/Styles";

// https://developers.google.com/maps/documentation/urls/guide#directions-action

const url = "https://www.google.com/maps/dir/?api=1&travelmode=walking";

export default function NavigateButton(props: { dest: string }) {
  return (
    <View style={Styles.buttonView}>
      <Button
        title="Navigate"
        onPress={() =>
          Linking.openURL(`${url}&destination=${encodeURI(props.dest)}`)
        }
        color={Colors.primary}
      />
    </View>
  );
}
