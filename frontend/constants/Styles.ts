import { StyleSheet } from "react-native";

import Colors from "./Colors";

export let Styles: any;

var isDark: boolean = false;

export function setDark(bool: boolean) {
  isDark = bool;
  console.log(isDark);
  if (isDark === false) {
    Styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "white"
      },
      wrapper: {
        padding: 10
      },
      titleText: {
        fontSize: 48,
        fontWeight: "bold",
        color: Colors.darkShades
      },
      paragraphText: {
        fontSize: 20
      },
      button: {
        backgroundColor: Colors.primary
      },
      infoText: {
        fontSize: 24
      },
      textInput: {
        fontSize: 24,
        marginVertical: 10,
        color: Colors.lightShades,
        borderBottomColor: Colors.lightShades,
        borderBottomWidth: 2
      },
      buttonView: {
        fontSize: 24,
        marginVertical: 5
      }
    });
  } else {
    Styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "black"
      },
      wrapper: {
        padding: 1
      },
      titleText: {
        fontSize: 8,
        fontWeight: "bold",
        color: Colors.darkShades
      },
      paragraphText: {
        fontSize: 0
      },
      button: {
        backgroundColor: Colors.primary
      },
      infoText: {
        fontSize: 4
      },
      textInput: {
        fontSize: 4,
        marginVertical: 10,
        color: Colors.lightShades,
        borderBottomColor: Colors.lightShades,
        borderBottomWidth: 2
      },
      buttonView: {
        fontSize: 4,
        marginVertical: 5
      }
    });
  }
}

export let LightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  wrapper: {
    padding: 10
  },
  titleText: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.darkShades
  },
  paragraphText: {
    fontSize: 20
  },
  button: {
    backgroundColor: Colors.primary
  },
  infoText: {
    fontSize: 24
  },
  textInput: {
    fontSize: 24,
    marginVertical: 10,
    color: Colors.lightShades,
    borderBottomColor: Colors.lightShades,
    borderBottomWidth: 2
  },
  buttonView: {
    fontSize: 24,
    marginVertical: 5
  }
});

export let DarkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  wrapper: {
    padding: 1
  },
  titleText: {
    fontSize: 8,
    fontWeight: "bold",
    color: Colors.darkShades
  },
  paragraphText: {
    fontSize: 0
  },
  button: {
    backgroundColor: Colors.primary
  },
  infoText: {
    fontSize: 4
  },
  textInput: {
    fontSize: 4,
    marginVertical: 10,
    color: Colors.lightShades,
    borderBottomColor: Colors.lightShades,
    borderBottomWidth: 2
  },
  buttonView: {
    fontSize: 4,
    marginVertical: 5
  }
});

// export default StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white"
//   },
//   wrapper: {
//     padding: 10
//   },
//   titleText: {
//     fontSize: 48,
//     fontWeight: "bold",
//     color: Colors.darkShades
//   },
//   paragraphText: {
//     fontSize: 20
//   },
//   button: {
//     backgroundColor: Colors.primary
//   },
//   infoText: {
//     fontSize: 24
//   },
//   textInput: {
//     fontSize: 24,
//     marginVertical: 10,
//     color: Colors.lightShades,
//     borderBottomColor: Colors.lightShades,
//     borderBottomWidth: 2
//   },
//   buttonView: {
//     fontSize: 24,
//     marginVertical: 5
//   }
// });
