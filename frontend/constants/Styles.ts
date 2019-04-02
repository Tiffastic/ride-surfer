import { StyleSheet, Dimensions } from "react-native";

import Colors from "./Colors";
const { width, height } = Dimensions.get("window");

export let Styles: any = StyleSheet.create({
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
  },
  queryBox: {
    borderColor: "#c3c3c3",
    backgroundColor: "white",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    fontSize: 24,
    width: width / 2.3,
    maxWidth: width / 2.3
  }
});

let listeners = new Set<(newStyles: any) => void>();

export function addStylesListener(listener: (newStyles: any) => void) {
  listeners.add(listener);
}

export function clearStylesListener(listener: (newStyles: any) => void) {
  if (!listeners.delete(listener)) {
    throw Error("couldn't delete listener!");
  }
}
export function setDark(bool: boolean) {
  // this is the light mode
  if (bool === false) {
    Styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "white"
      },
      containerProfile: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center"
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
      },
      queryBox: {
        borderColor: "#c3c3c3",
        backgroundColor: "white",
        color: "white",
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 24,
        width: width / 2.3,
        maxWidth: width / 2.3
      }
    });
    //this is the dark mode
  } else {
    Styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "black"
      },
      containerProfile: {
        flex: 1,
        backgroundColor: "black",
        alignItems: "center"
      },
      wrapper: {
        padding: 10
      },
      titleText: {
        fontSize: 48,
        fontWeight: "bold",
        color: Colors.lightShades
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
      },
      queryBox: {
        borderColor: "#c3c3c3",
        backgroundColor: "black",
        color: "white",
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 15,
        fontSize: 24,
        width: width / 2.3,
        maxWidth: width / 2.3
      }
    });
  }

  // rerender all the components
  for (let listener of listeners) {
    listener(Styles);
  }
}
