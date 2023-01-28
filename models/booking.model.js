const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Tour id is required.'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'User id is required.'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },

  price: {
    type: Number,
    required: [true, 'Price is required.'],
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
