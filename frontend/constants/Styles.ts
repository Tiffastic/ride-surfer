import { StyleSheet } from 'react-native';

import Colors from './Colors';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    wrapper: {
        padding: 10,
    },
    titleText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: Colors.darkShades,
    },
    paragraphText: {
        fontSize: 20,
    },
    button: {
        backgroundColor: Colors.primary,
    },
    infoText: {
        fontSize: 24,
    },
    textInput: {
        fontSize: 24,
        marginVertical: 10,
        color: Colors.lightShades,
        borderBottomColor: Colors.lightShades,
        borderBottomWidth: 2,

    },
    buttonView: {
        fontSize: 24,
        marginVertical: 5,
    }
});