import { Permissions, Notifications } from "expo";
import { fetchAPI } from "./Backend";
import UserSession from "./UserSession";

export async function registerForPushNotifications() {
  fetch("https://expo.io/status/live"); // NEED THIS TO CONNECT TO EXPO SERVER TO GET PUSH NOTIFICATION TOKEN
  //let statusResponse = await fetch("https://expo.io/status/live"); // DEBUG ONLY
  //let statusText = await statusResponse.text();
  //console.log(statusText);
  //alert(statusText);

  // check for existing permissions
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = status;

  // if not existing permissions, ask user for permission...
  if (status !== "granted") {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // user does not grant permission, so return
  if (finalStatus !== "granted") {
    return;
  }
  // alert("permission granted");

  // get the token for this unique device
  let token = await Notifications.getExpoPushTokenAsync();
  // alert(token);
  //console.log(token);

  //fetch("http://192.168.3.44:5000/api").then(res => console.log(res));

  // save the token in the database
  let userDetails = await UserSession.get();
  if (userDetails == null) return;

  const PUSH_ENDPOINT = "/users/" + userDetails.id;
  // POST the token to backend server from where you can retrieve it to send push notifications.
  await fetchAPI(PUSH_ENDPOINT, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ pushToken: token })
  })
    .then(response => {
      alert("Push Notification Registered");
    })
    .catch(error => {
      console.log(error);
    });
}
