import React from 'react';
import {
    TextInput,
    Text,
    ScrollView,
    StyleSheet,
    Button,
} from 'react-native';

export default function SignupScreen(props: any) {
    return (
        <ScrollView>
            <Text>Refactored Signup Screen</Text>

            <TextInput style={styles.textInput} placeholder="First Name"/>

            <TextInput style={styles.textInput} placeholder="Last Name"/>

            <TextInput style={styles.textInput} placeholder="Email"/>

            {/* TODO: this needs to hide what the user types in */}
            <TextInput style={styles.textInput} placeholder="Password"/>

            <TextInput style={styles.textInput} placeholder="Licence Plate"/>

            <TextInput style={styles.textInput} placeholder="Car Make"/>

            <TextInput style={styles.textInput} placeholder="Car Model"/>

            <TextInput style={styles.textInput} placeholder="Car Year"/>

            <Button title="Sign Up" onPress={() => props.navigation.navigate('Main')}/>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    textInput: {
        borderColor: '#c3c3c3',
        backgroundColor: 'white',
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 36,
    },
});