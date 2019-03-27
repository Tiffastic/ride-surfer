Bios = require("../models").Bios;

module.exports = {
  update(req, res) {
    Bios.findOne({
      where: {
        userId: req.params.userId
      }
    })
      .then(userBio => {
        userBio
          .update(req.body, { fields: Object.keys(req.body) })
          //.then(updatedBio => res.status(200).json(updatedBio))
          .catch(error => res.status(400).json(error));
      })
      .catch(error => console.log(error));
  },

  getImage(req, res) {
    Bios.findOne({
      where: {
        userId: req.params.userId
      }
    })
      .then(userBio => {
        res.status(200).json({ userImage: userBio.image });
      })
      .catch(error => res.status(400).json({ message: error }));
  },

  createBio(req, res) {
    Bios.create(req.body, { fields: Object.keys(req.body) })
      .then(bio => res.status(201).json(bio))
      .catch(error => res.status(400).json(error));
  }
};
