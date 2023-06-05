const { User } = require('../models');

module.exports = {
  async getAllUsers(req, res) {
      const users = await User.find();
      res.json(users);
  },

  async createUser(req, res) {
      const user = await User.create(req.body);
      res.json(user); 
  },

  async deleteUser(req, res) {
      const user = await User.findOneAndDelete({ _id: req.params.userId });
    },
};
