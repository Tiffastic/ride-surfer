import React from "react";
import HeaderButtons, { HeaderButton } from "react-navigation-header-buttons";
import Ionicons from "react-native-vector-icons/Ionicons";

import Colors from "../constants/Colors";

export default function RSIcon(props: {
  name: string;
  title: string;
  size?: number;
  color?: string;
  onPress?: () => void;
}) {
  return (
    <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton(props.color)}>
      <HeaderButton
        title={props.title}
        iconName={props.name}
        iconSize={props.size}
        onPress={props.onPress}
      />
    </HeaderButtons>
  );
}

const IoniconsHeaderButton = (color: string | undefined) => (
  passMeFurther: any
) => (
  // the `passMeFurther` variable here contains props from <Item .../> as well as <HeaderButtons ... />
  // and it is important to pass those props to `HeaderButton`
  // then you may add some information like icon size or color (if you use icons)
  <HeaderButton
    {...passMeFurther}
    IconComponent={Ionicons}
    iconSize={40}
    color={color === undefined ? Colors.primary : color}
    buttonStyle={{
      height: 60
    }}
  />
);
