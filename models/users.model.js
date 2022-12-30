const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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
  photo: String,
  password: {
    type: String,
    required: [true, 'please enter a password'],
    minLength: 8,
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
});

//Hashing the password to sage guard it against the attacks

userSchema.pre('save', async function (next) {
  //Check whether the password is modified or not.
  if (!this.isModified('password')) return next();

  //hash the password
  this.password = await bcrypt.hash(this.password, 14);

  //Removing the confirmPassword field
  this.confirmPassword = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
