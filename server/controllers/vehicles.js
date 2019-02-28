const Vehicle = require("../models").Vehicle;
const bcrypt = require("react-native-bcrypt");

module.exports = {
  create(req, res) {
    return Vehicle.create(req.body, { fields: Object.keys(req.body) })
      .then(vehicle => res.status(201).json(vehicle))
      .catch(error => res.status(400).json(error));
  },

  retrieveAll(req, res) {
    return Vehicle.findAll()
      .then(vehicles => {
        if (!vehicles) {
          return res.status(404).json({
            message: "Vehicle Not Found"
          });
        }
        return res.status(200).json(vehicles);
      })
      .catch(error => res.status(400).json(error));
  },

  retrieve(req, res) {
    return Vehicle.findByPk(req.params.id)
      .then(vehicle => {
        if (!vehicle) {
          return res.status(404).json({
            message: "Vehicle Not Found"
          });
        }
        return res.status(200).json(vehicle);
      })
      .catch(error => res.status(400).json(error));
  },

  destroy(req, res) {
    return Vehicle.findByPk(req.params.id)
      .then(vehicle => {
        if (!vehicle) {
          return res.status(400).json({
            message: "Vehicle Not Found"
          });
        }
        return vehicle
          .destroy()
          .then(() => res.status(204).json())
          .catch(error => res.status(400).json(error));
      })
      .catch(error => res.status(400).json(error));
  },

  update(req, res) {
    return Vehicle.findOne({
      where: {
        id: req.params.id
      }
    })
      .then(vehicle => {
        if (!vehicle) {
          return res.status(404).json({
            message: "Vehicle Not Found"
          });
        }

        return vehicle
          .update(req.body, { fields: Object.keys(req.body) })
          .then(updatedVehicle => res.status(200).json(updatedVehicle))
          .catch(error => res.status(400).json(error));
      })
      .catch(error => res.status(400).json(error));
  }
};
