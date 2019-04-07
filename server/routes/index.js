const usersController = require("../controllers").users;
const vehiclesController = require("../controllers").vehicles;
const journeysController = require("../controllers").journeys;
const tracesController = require("../controllers").traces;
const passengerRideController = require("../controllers").passengerRides;
const RateRide = require("../models").RateRides;
const pushNotificationController = require("../controllers").pushNotifications;
const calculateRatingsController = require("../controllers").calculateRatings;
const biosController = require("../controllers").bios;
const journeyRidesPhotosController = require("../controllers")
  .journeyRidesPhotos;
const forgotPasswordController = require("../controllers").forgotPassword;

const messagechatController = require("../controllers").messagechats;

module.exports = app => {
  //Using CORS, without this, Swagger  does not work with local host
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, HEAD");
    next();
  });

  app.get("/api", (req, res) =>
    res.status(200).send({
      message: "Welcome to the Ride Surfer API!"
    })
  );

  app.get("/users/", usersController.retrieveAll);
  app.get("/users/:id", usersController.retrieve);
  app.post("/users", usersController.create);
  app.post("/users/login", usersController.retrieveByLoginInfo);
  app.put("/users/:id", usersController.update);
  app.delete("/users/:id", usersController.destroy);

  app.all("/users/:id/items", (req, res) =>
    res.status(405).send({
      message: "Method Not Allowed"
    })
  );

  app.get("/verifyUserPassword", usersController.verifyUserPassword);

  app.get("/vehicles/", vehiclesController.retrieveAll);
  app.get("/vehicles/:id", vehiclesController.retrieve);
  app.get("/getUserVehicles", vehiclesController.getUserVehicles);
  app.post("/vehicles", vehiclesController.create);
  app.put("/vehicles/:id", vehiclesController.update);
  app.delete("/vehicles/:id", vehiclesController.destroy);

  app.get("/journeys", journeysController.retrieveAll);
  app.get("/journeys/matches", journeysController.retrieveMatches);
  app.get("/journeys/:id", journeysController.retrieve);
  app.post("/journeys", journeysController.create);
  app.put("/journeys/updateLocation", journeysController.updateAll);
  app.put("/journeys/:id", journeysController.update);
  app.post("/getDrivingRoute", journeysController.getDrivingRoute);

  app.get("/traces", tracesController.retrieveAll);
  app.get("/traces/:id", tracesController.retrieve);
  app.post("/traces", tracesController.create);

  app.get("/passengerRides", passengerRideController.retrieveAll);
  app.get(
    "/passengerRides/drive/:id",
    passengerRideController.retrieveDrivingRides
  );
  app.get(
    "/passengerRides/passenger/:id",
    passengerRideController.retrievePassengerRides
  );
  app.post("/passengerRides", passengerRideController.create);
  app.put("/passengerRides/:id", passengerRideController.update);
  app.delete("/passengerRides/:id", passengerRideController.destroy);

  app.post("/rateride", (req, res) => {
    RateRide.create(req.body, { fields: Object.keys(req.body) })
      .then(rating => res.status(201).json(rating))
      .catch(error => res.status(400).json(error));
  });

  /*
  app.get(
    "/ridePushNotificationRequest",
    pushNotificationController.notifyDriver
  );
  */

  app.get("/pushNotificationMessage", pushNotificationController.notifyUser);

  app.get(
    "/usersOverallRating/:id",
    calculateRatingsController.calculateAvgOverallRating
  );

  app.get(
    "/usersSafetyRating/:id",
    calculateRatingsController.calculateAvgSafetyRating
  );
  app.get(
    "/usersTimelinessRating/:id",
    calculateRatingsController.calculateAvgTimelinessRating
  );
  app.get(
    "/usersCleanlinessRating/:id",
    calculateRatingsController.calculateAvgCleanlinessRating
  );

  app.put("/updateBios/:userId", biosController.update);
  app.get("/getUserImage/:userId", biosController.getImage);
  app.post("/createBio", biosController.createBio);

  app.get(
    "/myDriversPhotos/:userId",
    journeyRidesPhotosController.getMyDriversPhotos
  );

  app.get(
    "/myPassengersPhotos/:userId",
    journeyRidesPhotosController.getMyPassengersPhotos
  );

  app.get(
    "/getChatSessionInfo",
    messagechatController.getChatSessionInfo_ByEmail
  );

  app.post(
    "/saveChatSessionMessage",
    messagechatController.saveChatSessionMessage
  );

  app.get(
    "/getLatestChatSessionMessages",
    messagechatController.getLatestChatSessionMessages
  );

  app.get(
    "/getLatestChatSessionMessagesRawQuery",
    messagechatController.getLatestChatSessionMessages_RawQuery
  );

  app.get(
    "/getOurChatSessionConversations",
    messagechatController.getOurChatSessionConversations
  );

  app.get("/getOurChatId", messagechatController.getOurChatId);

  app.get(
    "/getChatIdAndRecipientPhoto",
    messagechatController.getChatIdAndRecipientPhoto
  );

  app.post(
    "/sendChatMessageByRecipientId",
    messagechatController.sendChatMessage_ByRecipientId
  );

  app.get(
    "/sendPasswordResetLink",
    forgotPasswordController.sendPasswordResetLink
  );

  app.get(
    "/verifiedResetPasswordLink",
    forgotPasswordController.verifiedResetPasswordLink
  );
};
