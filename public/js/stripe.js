import axios from 'axios';
import { showAlert } from './alertHandler';
import { loadStripe } from '@stripe/stripe-js';

export const createStripeSession = async (tourId) => {
  try {
    const stripe = await loadStripe(
      'pk_test_51L8EN1SHNTeIOfJqUhIRP2zpugafKTqWzbilvXYQrjy3k1P7ShGzOWpuUaA4VLzzLgAYe5hmRgaffSUWj9M4hy6z00c5q4AEfV'
    );

    const res = await axios.get(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(res.data);
    stripe.redirectToCheckout({
      sessionId: res.data.session.id,
    });
  } catch (err) {
    console.log('error:', err);
    showAlert('something went wrong', 'error');
  }
};
