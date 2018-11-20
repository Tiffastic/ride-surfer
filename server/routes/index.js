const usersController = require('../controllers').users;

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Ride Surfer API!',
  }));

  app.get('/users/', usersController.retrieveAll);
  app.get('/users/:id', usersController.retrieve);
  app.post('/users', usersController.create);
  app.put('/users/:id', usersController.update);
  app.delete('/users/:id', usersController.destroy);

  app.all('/users/:id/items', (req, res) =>
    res.status(405).send({
      message: 'Method Not Allowed',
  }));
};
