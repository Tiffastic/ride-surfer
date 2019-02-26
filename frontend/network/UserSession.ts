import { AsyncStorage } from "react-native";

// so gross, lol
// undefined: haven't checked local storage
// null: have checked, aren't logged in
// User: have checked, logged in with this info
let currentUser: User | null | undefined = undefined;

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  vehicles: [{}];
  hasUpdated: boolean;
}

export default {
  // cursed
  get: async (): Promise<User | null> => {
    if (currentUser !== undefined) {
      console.log(
        "UserSession.get: from cache: " + JSON.stringify(currentUser)
      );
      return currentUser;
    }
    let blob = await AsyncStorage.getItem("userDetails");
    console.log("UserSession.get: from AyncStorage: " + blob);
    currentUser = blob === null ? null : (JSON.parse(blob) as User);
    return currentUser;
  },
  // cursed
  set: async (user: User) => {
    console.log("UserSession.set: " + JSON.stringify(user));
    await AsyncStorage.setItem("userDetails", JSON.stringify(user));
    currentUser = user;
  },
  // cursed
  clear: async () => {
    console.log("UserSession.clear()");
    await AsyncStorage.clear();
    currentUser = null;
  }
};
