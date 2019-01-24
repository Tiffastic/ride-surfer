const usersController = require("../controllers").users;
const journeysController = require("../controllers").journeys;
const tracesController = require("../controllers").traces;

module.exports = app => {
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

  app.get("journeys/:id", journeysController.retrieve);
  app.post("/journeys", journeysController.create);
  app.put("/journeys/:id", journeysController.update);

  app.get("traces/:id", tracesController.retrieve);
  app.post("/traces", tracesController.create);
};
