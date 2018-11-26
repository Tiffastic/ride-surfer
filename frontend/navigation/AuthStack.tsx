import React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { createStackNavigator } from 'react-navigation';

// TODO: have these in separate classes
function LoginScreen(props: any) {
    return (
        <View>
            <Text style={styles.item}>Login Screen (Thuy's Screen)</Text>

            <Button title="Log in" onPress={() => props.navigation.navigate('Main')}/>
        </View>
    );
}
function SignupScreen(props: any) {
    return (
        <View>
            <Text style={styles.item}>Signup Screen</Text>

            <Button title="Sign Up" onPress={() => props.navigation.navigate('Main')}/>
        </View>
    );
}

export default createStackNavigator({
    AuthLanding: AuthLandingScreen,
    Login: LoginScreen,
    Signup: SignupScreen,
});

function AuthLandingScreen(props: any) {
    return (
        <View>
            <Text style={styles.item}>Welcome, new user...</Text>

            <View style={styles.item}>
                <Button title="Log in" onPress={() => props.navigation.navigate('Login')}/>
            </View>
            <View style={styles.item}>
                <Button title="Sign Up" onPress={() => props.navigation.navigate('Signup')}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        paddingBottom: 10,
    },
});