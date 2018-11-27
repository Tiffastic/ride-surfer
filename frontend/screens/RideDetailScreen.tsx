import React from 'react';
import {
    View,
    Text,
    Button,
} from 'react-native';

export default function RideDetailScreen(props: any) {
    let driver = props.navigation.getParam('driver', {name: 'no driver', rating: 0});
    return (
        <View>
            <Text>
                Ride Details
            </Text>

            <Text>{driver.name}</Text>
            <Text>{driver.rating} stars</Text>

            <Button title="Request" onPress={() => console.log("Request: " + driver)}/>
        </View>
    );
};