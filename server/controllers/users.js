const User = require("../models").User;

module.exports = {
  create(req, res) {
    // TODO bcrypt here and then store
    var bcrypt = require("bcryptjs");
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hash;
    // Store hash in your password DB.
    return User.create(req.body, { fields: Object.keys(req.body) })
      .then(user => res.status(201).json(user))
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
    return User.findByPk(req.params.id)
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
    return User.find({
      where: {
        email: req.body.email
      }
    })
      .then(user => {
        if (!user) {
          return res.status(404).json({
            message: "User Not Found"
          });
        } else if (!bcrypt.compareSync(req.body.password, user.password)) {
          return res.status(404).json({
            message: "Password or Username is incorrect"
          });
        }

        return res.status(200).json(user);
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
    return User.find({
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
