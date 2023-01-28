const mongoose = require('mongoose');

//user defined requires
const Tour = require('../models/tour.model');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can't be empty"],
    },
    rating: {
      type: Number,
      max: [5, 'Max rating is 5.'],
      min: [1, 'Minimum rating is 1.'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//adding index to avoid multiple reviews from same user on the tour.
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

//Review static method

reviewSchema.statics.calculateAverageRatings = async function (tour) {
  const data = await this.aggregate([
    {
      $match: { tour },
    },
    {
      $group: {
        _id: 'tour',
        nRatings: {
          $sum: 1,
        },
        ratingAverage: {
          $avg: '$rating',
        },
      },
    },
  ]);

  if (data.length > 0) {
    await Tour.findByIdAndUpdate(tour, {
      ratingsAverage: data[0].ratingAverage,
      ratingsQuantity: data[0].nRatings,
    });
  } else {
    await Tour.findByIdAndUpdate(tour, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

//This is for calculating average rating whenever a new review was created.
reviewSchema.post('save', async function (doc, next) {
  this.constructor.calculateAverageRatings(doc.tour);
  next();
});

//This is for calculating the average rating whenever the existing the review either updated or deleted.

reviewSchema.post(/^findOneAnd/, async function (data, next) {
  data.constructor.calculateAverageRatings(data.tour);
  next();
});

module.exports = mongoose.model('Review', reviewSchema);
