const crypto = require('crypto');

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const UserService = require('../services/auth.service');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'Email has to be unique'],
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'guide', 'lead-guide'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'please enter a password'],
    minLength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'please provide password'],
    validate: {
      validator: function (pass) {
        return pass === this.password;
      },
      message: 'Password fields are not matching.',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

//Hashing the password to sage guard it against the attacks

userSchema.pre('save', async function (next) {
  //Check whether the password is modified or not.
  if (!this.isModified('password')) return next();

  //hash the password
  this.password = await bcrypt.hash(this.password, 12);

  //Removing the confirmPassword field
  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save', function (next) {
  console.log('pre2');
  if (!this.isModified('password') || this.isNew) return next();
  console.log('passwordChangedAt');
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.verifyPassword = async (enteredPassword, storedPassword) => {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

userSchema.methods.isPasswordChanged = function (tokenCreatedTime) {
  if (this.passwordChangedAt) {
    const passwordChangeInSeconds = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return passwordChangeInSeconds > tokenCreatedTime;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  // console.log({ resetToken }, this.passwordResetToken);
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
