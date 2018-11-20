const User = require('../models').User;

module.exports = {
  create(req, res) {
    return User
      .create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        car_plate: req.body.car_plate,
        car_make: req.body.car_make,
        car_model: req.body.car_model,
        car_year: req.body.car_year,
      })
      .then(user => res.status(201).send(user))
      .catch(error => res.status(400).send(error));
  },

  retrieveAll(req, res) {
  return User
    .findAll()
    .then(users => {
      if (!users) {
        return res.status(404).send({
          message: 'User Not Found',
        });
      }
      return res.status(200).send(users);
    })
    .catch(error => res.status(400).send(error));
  },

  retrieve(req, res) {
  return User
    .findByPk(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: 'User Not Found',
        });
      }
      return res.status(200).send(user);
    })
    .catch(error => res.status(400).send(error));
  },

  destroy(req, res) {
  return User
    .findByPk(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(400).send({
          message: 'User Not Found',
        });
      }
      return user
        .destroy()
        .then(() => res.status(204).send())
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
  },

  update(req, res) {
  return User
    .find({
        where: {
          id: req.params.id,
        },
      })
    .then(user => {
      if (!user ) {
        return res.status(404).send({
          message: 'User Not Found',
        });
      }

      return user
        .update(req.body, { fields: Object.keys(req.body) })
        .then(updatedUser => res.status(200).send(updatedUser))
        .catch(error => res.status(400).send(error));
    })
    .catch(error => res.status(400).send(error));
  },
};