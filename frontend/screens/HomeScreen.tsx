import React, { Component } from 'react';
import {
  FlatList,
  TextInput,
  TouchableHighlight,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { createStackNavigator, NavigationEvents } from 'react-navigation';
import { WebBrowser } from 'expo';
import DriverPickerScreen from './DriverPickerScreen';
import RideDetailScreen from './RideDetailScreen';

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

const dummyDrivers = [
  {
    key: 'bob',
    name: "Bob",
    home: require('./../assets/images/h-s1.png'),
    class: require('./../assets/images/h-l1.png'),
    work: require('./../assets/images/h-w1.png'),
    homeDirs: [{ key: '1', time: '1 min', desc: 'Walk to  4689 Holladay Blvd E' }, { key: '2', time: '16 mins', desc: 'Drive to 2000 1100 E' }, { key: '3', time: '5 mins', desc: 'Walk to 2011 1100 E' }],
    workDirs: [{ key: '1', time: '5 mins', desc: 'Walk to 4501 2565 E' }, { key: '2', time: '15 mins', desc: 'Drive to 290 1500 E' }, { key: '3', time: '2 mins', desc: 'Walk to 295 1500 E' }],
    classDirs: [{ key: '1', time: '5 mins', desc: 'Walk to 4501 2565 E' }, { key: '2', time: '15 mins', desc: 'Drive to 70 Central Campus Drive' }, { key: '3', time: '2 mins', desc: 'Walk to 72 Central Campus Dr' }],
  },
  {
    key: 'fred',
    name: "Fred",
    home: require('./../assets/images/h-s2.png'),
    class: require('./../assets/images/h-l2.png'),
    work: require('./../assets/images/h-w2.png'),
    homeDirs: [{ key: '1', time: '6 mins', desc: 'Walk to 2301 E Sky Pines Ct' }, { key: '2', time: '16 mins', desc: 'Drive to 2000 1100 E' }, { key: '3', time: '2 mins', desc: 'Walk to 2011 1100 E' }],
    workDirs: [{ key: '1', time: '1 min', desc: 'Walk to 4689 Holladay Blvd E' }, { key: '2', time: '15 mins', desc: 'Drive to 290 1500 E' }, { key: '3', time: '2 mins', desc: 'Walk to 295 1500 E' }],
    classDirs: [{ key: '2', time: '5 mins', desc: 'Walk to 4501 2565 E' }, { key: '2', time: '15 mins', desc: 'Drive to 70 Central Campus Drive' }, { key: '3', time: '2 mins', desc: 'Walk to 72 Central Campus Dr' }],
  },
  {
    key: 'daphne',
    name: "Daphne",
    home: require('./../assets/images/h-s3.png'),
    class: require('./../assets/images/h-l3.png'),
    work: require('./../assets/images/h-w3.png'),
    homeDirs: [{ key: '1', time: '5 mins', desc: 'Walk to 4501 2565 E' }, { key: '2', time: '16 mins', desc: 'Drive to 2000 1100 E' }, { key: '3', time: '2 mins', desc: 'Walk to 2011 1100 E' }],
    workDirs: [{ key: '1', time: '6 mins', desc: 'Walk to 2301 E Sky Pines Ct' }, { key: '2', time: '15 mins', desc: 'Drive to 290 1500 E' }, { key: '3', time: '2 mins', desc: 'Walk to 295 1500 E' }],
    classDirs: [{ key: '1', time: '1 min', desc: 'Walk to 4689 Holladay Blvd E' }, { key: '2', time: '15 mins', desc: 'Drive to 70 Central Campus Drive' }, { key: '3', time: '2 mins', desc: 'Walk to 72 Central Campus Dr' }],
  }
]



class AddressPicker extends React.Component<{ navigation: any }> {
  state = {
    text: '',
    selectedItem: null as null | { key: string, name: string, address: string },

  };

  _onPress(item: any) {
    this.props.navigation.push('DriverPicker', {address: item});
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={require('./../assets/images/map.jpg')} style={{width: '100%', height: '100%'}}>

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
}

const HomeStack = createStackNavigator({
  AddressPicker: AddressPicker,
  DriverPicker: DriverPickerScreen,
  RideDetail: RideDetailScreen,
})

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,

  };
  static HomeStack = {
    header: null,
  };

  render() {
    return (

      <View style={styles.container}>
        <HomeStack />
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  queryBox: {
    borderColor: '#c3c3c3',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    backgroundColor: 'rgba(0,0,0,0.5)',

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
