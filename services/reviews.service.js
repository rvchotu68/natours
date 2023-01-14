const Review = require('../models/reviews.model');

class ReviewService {
  async getAllReviewsService(filter) {
    return await Review.find(filter);
  }

  async addNewReviewService(req) {
    const { review, rating, tour, user } = req.body;
    return await Review.create({ review, rating, tour, user });
  }

  async deleteReviewService(id) {
    return await Review.findByIdAndDelete(id);
  }

  async updateReviewService(id, req) {
    return await Review.findByIdAndUpdate(id, req.body);
  }
}

module.exports = new ReviewService();
