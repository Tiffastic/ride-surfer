import { StyleSheet, Dimensions } from "react-native";

import Colors from "./Colors";
const { width, height } = Dimensions.get("window");

let LightStyle: any = StyleSheet.create({
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
    color: "black",
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 15,
    marginRight: 15,
    padding: 5,
    fontSize: 24,
    width: width - 30
    // maxWidth: width / 2.3
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold"
  }
});

let DarkStyle: any = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkShades
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
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 15,
    marginRight: 15,
    padding: 5,
    fontSize: 24,
    width: width - 30
    // maxWidth: width / 2.3
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.lightShades
  }
});

export let Styles: any = LightStyle;

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
    Styles = LightStyle;
    //this is the dark mode
  } else {
    Styles = DarkStyle;
  }
  //rerender all the components
  for (let listener of listeners) {
    listener(Styles);
  }
}

export function getDark() {
  return Styles === DarkStyle;
}
