import * as React from 'react';
import {
  FlatList,
  TextInput,
  TouchableHighlight,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  Button,
  View,
} from 'react-native';
import { createStackNavigator} from 'react-navigation';
import DriverPickerScreen from './DriverPickerScreen';
import DriverDetailsScreen from './DriverDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MessagesScreen from '../screens/MessagesScreen';
import RideInProgressScreen from './RideInProgressScreen';

const dummyAutofill = [
  {
    key: 'home',
    name: "Home",
    address: "2011 1100 E, Salt Lake City, UT 84106",
  },
  {
    key: 'work',
    name: "Work",
    address: "295 1500 E, Salt Lake City, UT 84112",
  },
  {
    key: 'class',
    name: "Warnock Engineering Building",
    address: "72 Central Campus Dr, Salt Lake City, UT 84112",
  },
];

class AddressPicker extends React.Component<{navigation: any}> {
  static navigationOptions = {
    title: 'Ride Surfer', // can be overidden from inside the stack

  };
  state = {
    text: '',
    selectedItem: null as null | { key: string, name: string, address: string },

  };

  _onPress(item: any) {
    this.props.navigation.push('DriverPicker', { address: item });
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('./../assets/images/map.jpg')} style={{ width: '100%', height: '100%' }}>

          <TextInput
            placeholder="Where to?"
            style={styles.queryBox}
            onChangeText={(text) => this.setState({ text })} />


          {this.state.text !== "" &&
            <FlatList
              style={styles.searchResultsList}
              data={dummyAutofill}
              renderItem={({ item, separators }) => (
                <TouchableHighlight
                  style={styles.searchResultsItem}
                  onPress={() => this._onPress(item)}
                  onShowUnderlay={separators.highlight}
                  onHideUnderlay={separators.unhighlight}>
                  <View>
                    <Text style={styles.searchResultsName}>{item.name}</Text>
                    <Text style={styles.searchResultsAddress}>{item.address}</Text>
                  </View>
                </TouchableHighlight>
              )} />}

        </ImageBackground>
      </View>
    );
  }
} // end of address picker class

export default createStackNavigator(
  {//RouteConfigs

    AddressPicker: {
      screen: AddressPicker,
      navigationOptions: ({ navigation }: { navigation: any }) => ({
        //  title: `from inside the stack`,
        headerRight: (
          <Button
            onPress={() => navigation.push('MessagesScreen')}
            title="Messages"
            color="#ffa64d"
          />
        ),
        headerLeft: (
          <Button
            onPress={() => navigation.push('ProfileScreen')}
            title="Profile"
            color="#ffa64d"
          />
        ),
        // headerBackTitle: null
      }),
    },
    ProfileScreen: ProfileScreen,
    DriverPicker: DriverPickerScreen,
    DriverDetails: DriverDetailsScreen,
    MessagesScreen: MessagesScreen,
    RideInProgress: RideInProgressScreen,

  }, {//StackNavigatorConfig

    initialRouteName: 'AddressPicker',
    // headerMode: 'none',
    navigationOptions: {//in react nav ver 3, this is called defaultNavigationOptions
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },

  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  queryBox: {
    borderColor: '#c3c3c3',
    backgroundColor: 'white',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    fontSize: 36,

  },
  searchResultsList: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  searchResultsItem: {
    borderColor: '#c3c3c3',
    borderBottomWidth: 1,
  },
  searchResultsName: {
    fontSize: 20,
  },
  searchResultsAddress: {
    fontSize: 20,
    color: 'grey',
  },

});
