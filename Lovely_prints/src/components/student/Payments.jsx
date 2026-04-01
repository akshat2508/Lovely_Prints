// payments.js
import { createPaymentOrder, verifyPayment } from "../../services/studentService";

export const startPayment = async (order, onSuccess, onFailure) => {
  try {
    const token = localStorage.getItem("access_token");

      if (!token) {
        onFailure("Session expired. Please login again.");
        return;
      }
    const res = await createPaymentOrder(order.id);
    const razorpayOrder = res.data;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: "INR",
      name: "Docuvio",
      description: `Order #${order.order_no}`,
      order_id: razorpayOrder.id,

      handler: async function (response) {
        try {
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: order.id,
          });

          onSuccess();
        } catch (err) {
          onFailure("Payment verification failed");
        }
      },

      modal: {
        ondismiss: function () {
          onFailure("Payment cancelled");
        },
      },

      theme: {
        color: "#8BAF29",
      },
    };

    const rzp = new window.Razorpay(options);

   rzp.on("payment.failed", function (response) {
  console.error("Razorpay payment failed:", response);
  onFailure(response.error.description || "Payment failed");
});


    rzp.open();
  } catch (err) {
    console.error("Payment failed", err);
    onFailure("Unable to initiate payment");
  }
};
