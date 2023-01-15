const Review = require('../models/reviews.model');
const ApiFeatures = require('../utils/apiFeatures');
class ReviewService {
  async getAllReviewsService(req, filter) {
    const filters = new ApiFeatures(Review.find(filter), req.query);
    filters.applyFilters();
    return await filters.query;
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

  async getReviewService(id) {
    return await Review.findById(id);
  }
}

module.exports = new ReviewService();
