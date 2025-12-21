import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

class PaymentService {
  async createOrder(amount, receipt) {
    return await razorpay.orders.create({
      amount: amount * 100, // rupees → paise
      currency: 'INR',
      receipt,
    });
  }
}

export default new PaymentService();
