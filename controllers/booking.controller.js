const stripe = require('stripe')(process.env.STRIPE_KEY);

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Tour = require('../models/tour.model');
const User = require('../models/users.model');
const Booking = require('../models/booking.model');
const handlerFactory = require('../utils/handler.factory');
const BookingService = require('../services/booking.service');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;

  //get tour details based on the tour id.
  const tour = await Tour.findById(tourId);
  //create a stripe session
  const session = await stripe.checkout.sessions.create({
    success_url: `${req.protocol}://${req.get(
      'host'
    )}/my-bookings?alert=booking`,
    mode: 'payment',
    cancel_url: `${req.protocol}://${req.get('host')}/`,
    client_reference_id: tourId,
    payment_method_types: ['card'],
    customer_email: req.user.email,
    line_items: [
      {
        name: tour.name,
        description: tour.summary,
        images: [
          `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`,
        ],
        amount: tour.price * 81 * 100,
        currency: 'inr',
        quantity: 1,
      },
    ],
  });

  //send the create stripe session as response to the client.

  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  //Check if the url contains tour, user and price query parameter. If not present then just return next and move to next middleware.
  const { tour, user, price } = req.query;
  if (!tour || !user || !price) return next();
  //Create a new booking document and persist it in the db.
  await Booking.create({ tour, user, price });

  //change the original url to remove to the query params for security reasons and redirect to the new url.
  res.redirect(req.originalUrl.split('?')[0]);
});

exports.getMyBookings = catchAsync(async (req, res, next) => {
  //get tours booked by the user using user id.
  const bookings = await Booking.find({ user: req.user._id });

  //extract the tour id and store in a array.
  const tourIds = bookings.map((booking) => booking.tour._id);

  //get tours based on the tour id stored in the array.

  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render('overview', {
    title: 'My bookings',
    tours,
  });
});

exports.createBooking = handlerFactory.createOne(
  BookingService.createBookingService
);
exports.getAllBookings = handlerFactory.getAll(
  BookingService.getAllBookingsService
);
exports.getBooking = handlerFactory.getOne(BookingService.getBookingService);
exports.updateBooking = handlerFactory.updateOne(
  BookingService.updateBookingService
);
exports.deleteBooking = handlerFactory.DeleteOne(
  BookingService.deleteBookingService
);

const createWebhookBooking = async (session) => {
  console.log('createWebhookBooking');
  console.log({ session });
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email }))._id;
  const price = session.amount_total / 100;

  await Booking.create({ tour, user, price });
};

exports.webhookBookingCheckout = (req, res, next) => {
  console.log('webhookBookingCheckout');

  const signature = req.headers['stripe-signature'];

  let event;
  console.log('event');
  console.log(req.body);
  try {
    console.log('inside try');
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_BOOKING_SECRET
    );
    console.log('after stripe constructEvent');
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  console.log({ event });
  console.log(event.type);
  if (event.type === 'checkout.session.completed')
    createWebhookBooking(event.data.object);

  console.log('sending response to striper server');
  res.status(200).json({ received: true });
};
