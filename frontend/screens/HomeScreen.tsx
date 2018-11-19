import React from 'react';
import {
  FlatList,
  TextInput,
  TouchableHighlight,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { WebBrowser } from 'expo';

const dummyAutofill = [
  {
    key: 'home',
    name: "Home",
    address: "123 Easy Street",
  },
  {
    key: 'work',
    name: "Work",
    address: "5678 Campus Drive",
  },
  {
    key: 'lib',
    name: "Marriott Library",
    address: "295 S Campus Dr, Salt Lake City, UT 84112",
  },
];

class AddressPicker extends React.Component {
  state = {
    text: '',
    selectedItem: null as null | {key: string, name: string, address: string},
  };

  _onPress(item) {
    this.props.navigation.push('SearchResults', {address: item});
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          placeholder="Where to?"
          style={styles.queryBox}
          onChangeText={(text) => this.setState({text})}/>

        <Text>Text: {this.state.text}</Text>

        {this.state.text !== "" &&
          <FlatList
            style={styles.searchResultsList}
            data={dummyAutofill}
            renderItem={({item, separators}) => (
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
            )}/>}
      </View>
    );
  }
}

function SearchResults(props) {
  let item = props.navigation.getParam('address', {name: 'Not Found', address: '-'});
  return (
    <View style={styles.container}>
      <Text>Search Results</Text>
      <Text>Here's how to get to:</Text>
      <Text>{item.name}</Text>
      <Text>{item.address}</Text>
    </View>
  );
}

const HomeStack = createStackNavigator({
  AddressPicker: AddressPicker,
  SearchResults: SearchResults,
})

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <HomeStack/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  queryBox: {
    borderColor: '#c3c3c3',
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
