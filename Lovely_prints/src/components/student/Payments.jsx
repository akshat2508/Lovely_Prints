import { createPaymentOrder, verifyPayment } from "../../services/studentService"

const Payments = ({ order, onSuccess }) => {
  const handlePayment = async () => {
    try {
      // 1️⃣ Create Razorpay order
      const res = await createPaymentOrder(order.id)

      const razorpayOrder = res.data

      // 2️⃣ Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Lovely Prints",
        description: `Order #${order.order_no}`,
        order_id: razorpayOrder.id,

        handler: async function (response) {
          // 3️⃣ Verify payment
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: order.id,
          })

          onSuccess()
        },

        theme: {
          color: "#F58220",
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error("Payment failed", err)
      alert("Payment failed")
    }
  }

  return (
    <button className="submit-btn1" onClick={handlePayment}>
      Pay ₹{order.total_price}
    </button>
  )
}

export default Payments
