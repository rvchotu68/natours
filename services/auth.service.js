const User = require('../models/users.model');

class UserService {
  async signupService(req) {
    const data = await User.create(req.body);
    return data;
  }
}

module.exports = new UserService();
