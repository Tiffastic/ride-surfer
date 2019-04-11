const User = require("../models").User;
const Vehicle = require("../models").Vehicle;
const bcrypt = require("react-native-bcrypt");

module.exports = {
  create(req, res) {
    // TODO bcrypt here and then store
    // Store hash in your password DB.
    return User.create(req.body, { fields: Object.keys(req.body) })
      .then(user => {
        res.status(201).json(user);
      })
      .catch(error => res.status(400).json(error));
  },

  retrieveAll(req, res) {
    return User.findAll()
      .then(users => {
        if (!users) {
          return res.status(404).json({
            message: "User Not Found"
          });
        }
        return res.status(200).json(users);
      })
      .catch(error => res.status(400).json(error));
  },

  retrieve(req, res) {
    return User.findOne({
      where: {
        id: req.params.id
      },
      include: [{ model: Vehicle, as: "vehicles" }]
    })
      .then(user => {
        if (!user) {
          return res.status(404).json({
            message: "User Not Found"
          });
        }
        return res.status(200).json(user);
      })
      .catch(error => res.status(400).json(error));
  },

  retrieveByLoginInfo(req, res) {
    return User.findOne({
      where: {
        email: req.body.email
      },
      include: [{ model: Vehicle, as: "vehicles" }]
    })
      .then(user => {
        if (!user) {
          return res.status(404).json({
            message: "Password or Username is incorrect"
          });
        } else if (!bcrypt.compareSync(req.body.password, user.password)) {
          return res.status(404).json({
            message: "Password or Username is incorrect!"
          });
        }

        return res.status(200).json(user);
      })
      .catch(error => res.status(400).json(error));
  },

  verifyUserPassword(req, res) {
    User.findOne({
      where: {
        id: req.query.userId
      }
    })
      .then(result => {
        if (!result) {
          return res.status(404).json({ message: "Email does not exist." });
        } else if (!bcrypt.compareSync(req.query.password, result.password)) {
          res.status(404).json({ message: "Password does not match" });
        }

        res.status(200).json(result);
      })
      .catch(error => res.status(400).json(error));
  },

  destroy(req, res) {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) {
          return res.status(400).json({
            message: "User Not Found"
          });
        }
        return user
          .destroy()
          .then(() => res.status(204).json())
          .catch(error => res.status(400).json(error));
      })
      .catch(error => res.status(400).json(error));
  },

  update(req, res) {
    return User.findOne({
      where: {
        id: req.params.id
      }
    })
      .then(user => {
        if (!user) {
          return res.status(404).json({
            message: "User Not Found"
          });
        }

        return user
          .update(req.body, { fields: Object.keys(req.body) })
          .then(updatedUser => res.status(200).json(updatedUser))
          .catch(error => res.status(400).json(error));
      })
      .catch(error => res.status(400).json(error));
  }
};
