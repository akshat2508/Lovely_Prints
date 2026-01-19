import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendReadyForPickupEmail = async ({
  email,
  name,
  orderNo,
  shopName,
}) => {
  await resend.emails.send({
    from: "Lovely Prints <no-reply@lovelyprints.co.in>",
    to: email,
    subject: "Your order is ready for pickup 🖨️",
    html: `
      <h2>Hi ${name} 👋</h2>
      <p>Your order <strong>#${orderNo}</strong> from <strong>${shopName}</strong>
      is <b style="color:green">READY FOR PICKUP</b>.</p>
      <p>Please visit the shop to collect it.</p>
      <hr />
      <small>Lovely Prints</small>
    `,
  });
};

export const sendOrderDeliveredEmail = async ({
  email,
  name,
  orderNo,
}) => {
  await resend.emails.send({
    from: "Lovely Prints <no-reply@lovelyprints.co.in>",
    to: email,
    subject: "Order delivered successfully ✅",
    html: `
      <h2>Thank you ${name}! 🎉</h2>
      <p>Your order <strong>#${orderNo}</strong> has been successfully delivered.</p>
      <p>We hope to serve you again.</p>
      <hr />
      <small>Lovely Prints</small>
    `,
  });
};
