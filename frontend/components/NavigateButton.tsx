import React from 'react';
import { Button, Linking } from 'react-native';

// https://developers.google.com/maps/documentation/urls/guide#directions-action

const url = 'https://www.google.com/maps/dir/?api=1&travelmode=walking';

export default function NavigateButton(props: {dest: string}) {
    return <Button
        title="Navigate"
        onPress={() => Linking.openURL(`${url}&destination=${encodeURI(props.dest)}`)}/>;
}
