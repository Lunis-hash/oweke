import client from './api';

export async function initStripePayment(packId: string, amount?: number) {
  try {
    const res = await client.post('/payment/create-intent', { packId, amount });
    return res.data;
  } catch (error) {
    console.error('Failed to init stripe payment', error);
    throw error;
  }
}

export async function processPayment(paymentIntentId: string, ...args: any[]) {
  try {
    const res = await client.post('/payment/confirm', { paymentIntentId });
    return res.data;
  } catch (error) {
    console.error('Failed to process payment', error);
    throw error;
  }
}

export const PaymentService = {
  initStripePayment,
  processPayment,
  createPaymentIntent: initStripePayment,
  confirmPayment: processPayment,
};

export default PaymentService;
