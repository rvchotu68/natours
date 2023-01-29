const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('../models/users.model');

class AuthService {
  async signupService(req) {
    const { name, email, password, confirmPassword, role } = req.body;

    const data = await User.create({
      name,
      email,
      password,
      confirmPassword,
      role,
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

    if (
      !userData ||
      !(await userData.verifyPassword(password, userData.password))
    )
      return null;
    //return jwtToken if the user is verified or else return null.

    return userData;
  }

  async verifyJWTToken(token) {
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
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    };

    // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    user.password = undefined;
    res.cookie('jwt', jwtToken, cookieOptions);
    res.status(statusCode).json({
      status: 'success',
      jwtToken,
      user,
    });
  }

  async deleteUserService(id) {
    return await User.findByIdAndDelete(id);
  }
}

module.exports = new AuthService();
