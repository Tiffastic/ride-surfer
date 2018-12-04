import React from 'react';
import { ScrollView, View, StyleSheet, Text, Button, Image, AsyncStorage } from 'react-native';

export default class LinksScreen extends React.Component<{ navigation: any }> {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    var userDetails = await AsyncStorage.getItem('userDetails');
    if (userDetails == null) throw ':(';
    const user = JSON.parse(userDetails);
    this.setState({ user });
  }
  static navigationOptions = {
    title: 'Profile',
  };
  state = {
    user: { id: '', first_name: 'Not Found', last_name: '', email: '', car_year: '', car_make: '', car_model: '', car_plate: '', }
  };

  render() {
    let name = this.state.user.first_name + ' ' + this.state.user.last_name;
    let car = this.state.user.car_year + ' ' + this.state.user.car_make + ' ' + this.state.user.car_model
    return (
      <View style={styles.container}>
        <Image style={{ flex: 1, width: undefined, height: undefined }}
          resizeMode='center'
          source={require('./../assets/images/default-profile.png')}
        />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text >{name}</Text>
          <Text>{this.state.user.email}</Text>
          <Text >{car}</Text>
          <Text>{this.state.user.car_plate}</Text>
        </View>

        <Button title="Log Out" onPress={this._logOut} />
      </View>
    );
  }

  _logOut = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth')
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  tableRow: {
    flexDirection: 'row',
  },
});
