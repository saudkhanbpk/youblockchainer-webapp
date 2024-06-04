import { loadStripe } from '@stripe/stripe-js';

let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe('pk_test_51PNZQSDmMfVWb91lVcKSkfQu6QsaWydE0FMu91wM9TM2OeBFC2hMEjh9sH6ZY3ivqhcATv73ft8ZCDqOwiMh8S0900K9EPNYcd');
  }
  return stripePromise;
};

export default getStripe;