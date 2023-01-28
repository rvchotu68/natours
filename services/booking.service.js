const Booking = require('../models/booking.model.js');

class BookingService {
  async getAllBookingsService(req, filter) {
    return await Booking.find(filter);
  }

  async getBookingService(id) {
    return await Booking.findById(id);
  }

  async createBookingService(req) {
    return await Booking.create(req.body);
  }

  async updateBookingService(id, req) {
    return await Booking.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
  }

  async deleteBookingService(id) {
    return await Booking.findByIdAndDelete(id);
  }
}

module.exports = new BookingService();
