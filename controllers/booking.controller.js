const stripe = require('stripe')(process.env.STRIPE_KEY);

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Tour = require('../models/tour.model');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;

  //get tour details based on the tour id.
  const tour = await Tour.findById(tourId);
  //create a stripe session
  const session = await stripe.checkout.sessions.create({
    success_url: `${req.protocol}://${req.get('host')}/`,
    mode: 'payment',
    cancel_url: `${req.protocol}://${req.get('host')}/${tourId}`,
    client_reference_id: tourId,
    payment_method_types: ['card'],
    customer_email: req.user.email,
    line_items: [
      {
        name: tour.name,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 81 * 100,
        currency: 'inr',
        quantity: 1,
      },
    ],
  });

  console.log({ session });

  //send the create stripe session as response to the client.

  res.status(200).json({
    status: 'success',
    session,
  });
});
