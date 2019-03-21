import { createSwitchNavigator, createAppContainer } from "react-navigation"; // ver 3 has and we need, createAppContainer
import AuthStack from "./AuthStack";
import Drawer from "../navigation/Drawer";

export default createAppContainer(
  createSwitchNavigator(
    {
      // Read more at https://reactnavigation.org/docs/en/auth-flow.html
      Auth: AuthStack,
      Main: Drawer
    },
    {
      initialRouteName: "Auth"
    }
  )
);
