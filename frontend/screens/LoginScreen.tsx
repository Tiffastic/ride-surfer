
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TextInput,
    Button
} from 'react-native';
import { WebBrowser } from 'expo';


export default class HomeScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                    <View style={styles.welcomeContainer}>
                        <Image
                            source={
                                __DEV__
                                    ? require('../assets/images/Loginsurfboard.png')//require('../assets/images/robot-dev.png')
                                    : require('../assets/images/robot-prod.png')
                            }
                            style={styles.welcomeImage}
                            />
                    </View>

                    <View style={styles.getStartedContainer}>

                        <Text style={styles.getStartedText}>Log into Ride Surfer </Text>

                        <View style={styles.loginContainer}>
                            <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
                                <Text>Email: </Text>
                                <TextInput placeholder='rideSurfer@waves.com' style={styles.input}></TextInput>
                            </View>

                            <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
                                <Text>Password: </Text>
                                <TextInput placeholder='********' style={styles.input}></TextInput>
                            </View>

                        </View>


                    </View>

                    <View style={styles.surfButton}>
                        <Button  title='Log in!' onPress={this._handleLearnMorePress}></Button>
                    </View>
                </ScrollView>

            </View>
        );
    }



    _handleLearnMorePress = () => {
        WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
    };


}

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        backgroundColor: '#34889b'
    },

    contentContainer:
    {
        paddingTop: 30,
    },

    welcomeContainer:
    {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },

    welcomeImage:
    {
        width: 200,
        height: 150,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10,
    },

    getStartedContainer:
    {
        alignItems: 'center',
        marginHorizontal: 50,
    },

    getStartedText:
    {
        fontSize: 17,
        color: 'black',
        lineHeight: 24,
        textAlign: 'center',
    },

    homeScreenFilename:
    {
        marginVertical: 7,
    },

    codeHighlightContainer: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingTop: 5
    },

    logoContainer: {
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },

    logo:
    {
        width: 100,
        height: 100
    },

    title: {
        color: '#FFF',
        marginTop: 10,
        width: 160,
        textAlign: 'center',
        opacity: 0.9
    },

    input:
    {
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 20,
        color: '#2677A2',
        paddingHorizontal: 70,
    },

    loginContainer:
    {
        paddingTop: 15,
        paddingBottom: 10
    },

    surfButton:
    {

        alignItems: 'center',

    }


});
