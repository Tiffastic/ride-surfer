import React from 'react';
import { ScrollView, StyleSheet, Text, Button } from 'react-native';

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Profile',
  };

  props: {
    navigation: any,
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text>Your Profile, on TypeScript.</Text>

        <Button title="Log Out" onPress={() => this.props.navigation.navigate('Auth')}/>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
