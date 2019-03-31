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

export function setDark(bool: boolean) {
  if (bool === false) {
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
      },
      queryBox: {
        borderColor: "#c3c3c3",
        backgroundColor: "black",
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
}

let listeners = new Set<(newStyles: any) => void>();

export function addStylesListener(listener: (newStyles: any) => void) {
  listeners.add(listener);
}

export function clearStylesListener(listener: (newStyles: any) => void) {
  listeners.delete(listener);
}
