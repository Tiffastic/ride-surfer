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

import Colors from '../constants/Colors';

import DriverPickerScreen from './DriverPickerScreen';
import DriverDetailsScreen from './DriverDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MessageContactsScreen from '../screens/MessageContactsScreen';
import MessageConversationsScreen from '../screens/MessageConversationsScreen';
import RideInProgressScreen from './RideInProgressScreen';
import RateDriverScreen from './RateDriverScreen';

const dummyAutofill = [
  {
    key: 'home',
    name: "Home",
    address: "2011 1100 E, Salt Lake City, UT 84106",
    preview: require('../assets/images/h-s-preview.png'),
  },
  {
    key: 'work',
    name: "Work",
    address: "295 1500 E, Salt Lake City, UT 84112",
    preview: require('../assets/images/h-l-preview.png'),
  },
  {
    key: 'class',
    name: "Warnock Engineering Building",
    address: "72 Central Campus Dr, Salt Lake City, UT 84112",
    preview: require('../assets/images/h-w-preview.png'),
  },
];

class AddressPicker extends React.Component<{navigation: any}> {
  static navigationOptions = {
    title: 'Ride Surfer', // can be overidden from inside the stack

  };
  state = {
    text: '',
  };

  _onPress(item: any) {
    this.setState({text: ''});
    this.props.navigation.push('DriverPicker', { address: item });
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('./../assets/images/map.jpg')} style={{ width: '100%', height: '100%' }}>

          <TextInput
            placeholder="Where to?"
            style={styles.queryBox}
            value={this.state.text}
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
          <View style={{width: 90}}>
            <Button
              onPress={() => navigation.push('MessageContacts')}
              title="Messages"
              color={Colors.primary}
            />
          </View>
        ),
        headerLeft: (
          <View style={{width: 90}}>
            <Button
              onPress={() => navigation.push('ProfileScreen')}
              title="Profile"
              color={Colors.primary}
            />
          </View>
        ),
        headerTitleStyle: {
          textAlign: 'center',
          flex: 1,
        }
      }),
    },
    ProfileScreen: ProfileScreen,
    DriverPicker: DriverPickerScreen,
    DriverDetails: DriverDetailsScreen,
    MessageContacts: MessageContactsScreen,
    MessageConversations: MessageConversationsScreen,
    RideInProgress: RideInProgressScreen,
    RateDriver: RateDriverScreen

  }, {//StackNavigatorConfig

    initialRouteName: 'AddressPicker',
    // headerMode: 'none',
    navigationOptions: {//in react nav ver 3, this is called defaultNavigationOptions
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTintColor: 'black',
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
