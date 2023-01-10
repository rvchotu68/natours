const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('../models/users.model');

class UserService {
  async signupService(req) {
    const { name, email, password, confirmPassword } = req.body;

    const data = await User.create({
      name,
      email,
      password,
      confirmPassword,
    });
    return data;
  }

  async createJWTToken(id) {
    const token = await jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_TOKEN_EXPIRES_IN,
    });
    return token;
  }

  async loginService(email, password) {
    //check if the passwords are matching or not.
    const userData = await User.findOne({ email }).select('+password');
    // console.log(userData);
    if (
      !userData ||
      !(await userData.verifyPassword(password, userData.password))
    )
      return null;
    //return jwtToken if the user is verified or else return null.
    return await this.createJWTToken(userData._id);
  }

  async verifyJWTToken(token) {
    // console.log(token,"\n",process.env.JWT_SECRET_KEY);
    return await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
  }

  async getUserById(id) {
    return await User.findById(id);
  }

  async getUserByEmail(email) {
    return await User.findOne({ email });
  }

  async getUserByResetToken(passwordResetToken) {
    return await User.findOne({
      passwordResetToken,
      passwordResetExpires: { $gt: Date.now() },
    });
  }

  async createPasswordRestTokenHash(resetToken) {
    return await crypto.createHash('sha256').update(resetToken).digest('hex');
  }

  async sendCreatedToken(user, statusCode, res) {
    const jwtToken = await this.createJWTToken(user._id);
    res.status(statusCode).json({
      status: 'success',
      jwtToken,
      user,
    });
  }
}

module.exports = new UserService();
