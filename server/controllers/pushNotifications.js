const { Expo } = require("expo-server-sdk");
const User = require("../models").User;

module.exports = {
  notifyDriver(req, res) {
    // Create a new Expo SDK client
    let expo = new Expo();

    // Create the messages that you want to send to clents
    let messages = [];

    // id of driver in the request query
    //var driverId = req.query.driverId;

    User.findByPk(req.query.driverId)
      .then(driver => {
        messages.push({
          to: driver.pushToken,
          sound: "default",
          title: "Incoming Ride Surf Request",
          body: "May I surf a ride?",
          data: { withSome: "data" }
        });

        let chunks = expo.chunkPushNotifications(messages);
        let tickets = [];
        (async () => {
          // Send the chunks to the Expo push notification service. There are
          // different strategies you could use. A simple one is to send one chunk at a
          // time, which nicely spreads the load out over time:
          for (let chunk of chunks) {
            try {
              let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
              console.log(ticketChunk);
              tickets.push(...ticketChunk);
              // NOTE: If a ticket contains an error code in ticket.details.error, you
              // must handle it appropriately. The error codes are listed in the Expo
              // documentation:
              // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
            } catch (error) {
              console.error(error);
            }
          }
        })();
      })
      .then(res.send("Ride Request Push Notification Sent!"))
      .catch(error => res.status(400).json(error));
  }
};
