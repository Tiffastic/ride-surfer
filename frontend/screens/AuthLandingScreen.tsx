import React from 'react';
import { StyleSheet, View, Button, Text, AsyncStorage } from 'react-native';
import { createStackNavigator } from 'react-navigation';

export default class AuthLandingScreen extends React.Component<{ navigation: any }> {
    constructor(props) {
        super(props);
        console.log('in constructor')
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place


    _bootstrapAsync = async () => {
        var userDetails = await AsyncStorage.getItem('userDetails');
        if (userDetails != null) {
            this.props.navigation.navigate('Main')
        }
    }

    render() {
        return (
            <View>
                <Text style={styles.item}>Welcome, new user...</Text>

                <View style={styles.item}>
                    <Button title="Log in" onPress={() => this.props.navigation.navigate('Login')} />
                </View>
                <View style={styles.item}>
                    <Button title="Sign Up" onPress={() => this.props.navigation.navigate('Signup')} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        paddingBottom: 10,
    },
})
