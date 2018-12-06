import React, { Component } from 'react';
import {
  FlatList,
  TouchableHighlight,
  Image,
  StyleSheet,
  Text,
  Button,
  View,
} from 'react-native';

import NavigateButton from '../components/NavigateButton';

import Colors from '../constants/Colors';
import Styles from '../constants/Styles';

export default class RideInProgressScreen extends React.Component<{ navigation: any }> {
  state = {
    address: this.props.navigation.getParam('address', { key: '', name: 'Not Found', address: '-' }),
    driver: this.props.navigation.getParam('driver', { name: 'Not Found', home: '', class: '', work: '' }),
  };

  render() {
    let image = this.state.driver.home;
    let dirs = this.state.driver.homeDirs;
    if (this.state.address.key == 'work') {
      image = this.state.driver.work;
      dirs = this.state.driver.workDirs;
    }
    else if (this.state.address.key == 'class') {
      image = this.state.driver.class;
      dirs = this.state.driver.classDirs;
    }

    return (
      <View style={styles.container}>
        <Image style={{ flex: 1.25, width: undefined, height: undefined }}
          resizeMode='stretch'
          source={image}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 25, margin: 5 }}>{this.state.driver.name}</Text>

          <Text style={{ fontSize: 15, marginLeft: 5 }}>Directions to {this.state.address.name}</Text>
          <FlatList
            data={dirs}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, separators }) => (
              <TouchableHighlight
                style={styles.searchResultsItem}
                onShowUnderlay={separators.highlight}
                onHideUnderlay={separators.unhighlight}>
                <View style={styles.flatview}>
                  <Text style={{ flex: 1 }}>{(item as any).time}</Text>
                  <Text style={{ flex: 2 }}>{(item as any).desc}</Text>
                </View>
              </TouchableHighlight>
            )} />

          <NavigateButton dest={dirs[0].addr}/>

          <View style={Styles.buttonView}>
            <Button
              title="Finish"
              onPress={() => this.props.navigation.navigate('RateDriver', {driver: this.state.driver})}
              color={Colors.darkAccent}/>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flatview: {
    justifyContent: 'center',
    paddingTop: 5,
    borderRadius: 2,
    flexDirection: 'row',
    margin: 5,
  },
  searchResultsList: {
    marginTop: 10,
    marginBottom: 10,
  },
  searchResultsItem: {
    borderColor: '#c3c3c3',
    borderBottomWidth: 1,
  },


});