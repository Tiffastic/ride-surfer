import React from 'react';
import {
    View,
    Text,
    Button,
    FlatList,
    TouchableHighlight,
    StyleSheet,
    ListRenderItemInfo
} from 'react-native';
import { ListRenderItem } from 'react-native';

type driver = {
    name: string,
    key: string,
    rating: number,
};

const dummyDrivers: driver[] = [
    {
        key: 'daphne',
        name: 'Daphne Driver',
        rating: 4.2,
    },
    {
        key: 'jim',
        name: 'Jim de St Germain',
        rating: 4.9,
    },
    {
        key: 'dax',
        name: 'Dax',
        rating: 1.3,
    }
];

export default class DriverPickerScreen extends React.Component {
    props: {
        navigation: any,
    };

    private chooseDriver = (item: driver) => {
        this.props.navigation.push('RideDetail', {driver: item});
    }

    render() {
        let address = this.props.navigation.getParam('address', {name: 'Not Found', address: '-'});
        return (
            <View style={styles.container}>
                <Text>Here are drivers who can get you to:</Text>
                <Text>{address.name}</Text>
                <Text>{address.address}</Text>

                <FlatList
                    style={styles.searchResultsList}
                    data={dummyDrivers}
                    renderItem={({item, separators}: any) => (

                    <TouchableHighlight
                        style={styles.searchResultsItem}
                        onPress={() => this.chooseDriver(item)}
                        onShowUnderlay={separators.highlight}
                        onHideUnderlay={separators.unhighlight}>

                        <View>
                            <Text style={styles.searchResultsName}>{item.name}</Text>
                            <Text style={styles.searchResultsAddress}>{item.rating} stars</Text>
                        </View>
                    </TouchableHighlight>
                )}/>
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
