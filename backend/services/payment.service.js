import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

class PaymentService {
  async createOrder(amount, receipt) {
    return await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt,
    });
  }

  async createOrderWithTransfer({ amount, receipt, transfers }) {
    return await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt,
      transfers,
    });
  }
}

export default new PaymentService();