import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button
} from 'react-native';


 import Stars from 'react-native-stars';
 import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

 import picDriver from '../assets/images/ThuyPic.png';
 

export default class RateDriverScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>

        <View style={{marginBottom: 20}}>
            <Image source={picDriver} style={{width: 200, height: 200, borderRadius: 100}}>
             
            </Image>
        </View>


       <Text style={{fontSize: 20, paddingBottom: 10}}>
        Rate Your Ride
       </Text>

      
        <View>
          <Stars
            rating={2.5}
            count={5}
            half={true}
            fullStar={<Icon name={'star'} style={[styles.myStarStyle]}/>}
            emptyStar={<Icon name={'star-outline'} style={[styles.myStarStyle, styles.myEmptyStarStyle]}/>}
            halfStar={<Icon name={'star'} style={[styles.myStarStyle]}/>}
          />
        </View>



        <View style={{marginTop:25}}>
          <TextInput 
                            multiline = {true} 
                            numberOfLines = {5}
                            style={{height: 80,
                                    width:220, 
                                    borderColor: 'gray', 
                                    borderWidth: 5, 
                                    paddingHorizontal: 10,
                                    backgroundColor: 'white'
                             }}
                             >
        </TextInput>
        </View>


        <View style={{marginTop: 20, width: 110}}>
          <Button title="Rate" color='rgb(48, 70, 226)' onPress={this._handleHelpPress}></Button>
        </View>
      </View>
    );
  }


  _handleHelpPress = () => {
    this.props.navigation.popToTop();
  };
}

const styles = StyleSheet.create({

  myStarStyle: {
    color: 'yellow',
    backgroundColor: 'transparent',
    textShadowColor: 'black',
    textShadowOffset: {width:1, height:1},
    textShadowRadius: 2,
    fontSize: 50
  },

  myEmptyStarStyle: {
    color: 'white',
  }, 

  container: {
    flex: 1,
    alignItems: 'center',
   justifyContent: 'center',
    backgroundColor: 'rgb(51, 170, 234)',
  },

});
