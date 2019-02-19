const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
  app.get('/api/upload', requireLogin, (req, res) => {

  })
};
