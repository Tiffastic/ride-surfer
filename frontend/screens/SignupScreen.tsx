import React from 'react';
import {
    TextInput,
    Text,
    ScrollView,
    StyleSheet,
    Button,
    AsyncStorage,
    View,
} from 'react-native';

export default class SignupScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };
    
  props: {
    navigation: any,
  };

    state = {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        car_make: '',
        car_model: '',
        car_year: '',
        car_plate: '',
        error: '',
    };

    render() {
        let showErr = (
            this.state.error ?
              <Text>
                {this.state.error}
              </Text> :
              <View></View>
          );
        return (
            <ScrollView>
                <Text>Register</Text>

                <TextInput style={styles.textInput} placeholder="First Name" onChangeText={(data) => this.setState({ first_name: data })} />

                <TextInput style={styles.textInput} placeholder="Last Name" onChangeText={(data) => this.setState({ last_name: data })}/>

                <TextInput style={styles.textInput} placeholder="Email" onChangeText={(data) => this.setState({ email: data })}/>

                {/* TODO: this needs to hide what the user types in */}
                <TextInput style={styles.textInput} placeholder="Password" onChangeText={(data) => this.setState({ password: data })}/>

                <TextInput style={styles.textInput} placeholder="Licence Plate" onChangeText={(data) => this.setState({ car_plate: data })}/>

                <TextInput style={styles.textInput} placeholder="Car Make" onChangeText={(data) => this.setState({ car_make: data })}/>

                <TextInput style={styles.textInput} placeholder="Car Model" onChangeText={(data) => this.setState({ car_model: data })}/>

                <TextInput style={styles.textInput} placeholder="Car Year" onChangeText={(data) => this.setState({ car_year: data })}/>

                <Button title="Sign Up" onPress={this._register} />
                {showErr}
            </ScrollView>
        );
    }

    private _register = async () => {
        return fetch('http://ride-surfer.herokuapp.com/users/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password,
            car_plate: this.state.car_plate,
            car_make: this.state.car_make,
            car_model: this.state.car_model,
            car_year: this.state.car_year,
          }),
        })
          .then((response) => response.json())
    
          .then((responseJson) => {
            if (responseJson.status == 400) {
              this.setState({
                error: responseJson.error
              })
            }
            else {
              this._saveUserAsync(responseJson).catch(console.log)
            }
          })
          .catch((error) => {
            console.log(error);
          });
      };
    
      private _saveUserAsync = async (userDetails: any) => {
        const jsonString = JSON.stringify(userDetails);
        await AsyncStorage.setItem('userDetails', jsonString);
        this.props.navigation.navigate('Main')
      };
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