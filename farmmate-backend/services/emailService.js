import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER?.trim(),
    pass: process.env.EMAIL_PASSWORD?.trim(),
  },
});

// Verify transporter configuration at startup to surface errors early
transporter.verify().then(() => {
  console.log("✅ Email transporter is ready");
}).catch(err => {
  console.error("❌ Email transporter verification failed:", err && err.message ? err.message : err);
});

export const sendBuyerEmail = async (buyerEmail, buyerName, orderId, totalAmount, items) => {
  const itemsList = items
    .map(item => `<li>${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}</li>`)
    .join("");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: buyerEmail,
    subject: "Order Confirmation - FarmMate",
    html: `
      <h2>Order Confirmed! ✓</h2>
      <p>Dear ${buyerName},</p>
      <p>Your order has been placed successfully on FarmMate.</p>
      
      <h3>Order Details:</h3>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
      
      <h3>Items Ordered:</h3>
      <ul>${itemsList}</ul>
      
      <p>You will receive your products soon. Thank you for shopping with FarmMate!</p>
      <p>Best regards,<br>FarmMate Team</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendFarmerEmail = async (farmerEmail, farmerName, buyerName, items, orderId) => {
  const itemsList = items
    .map(item => `<li>${item.name} x${item.quantity}</li>`)
    .join("");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: farmerEmail,
    subject: "New Order - Product Purchase - FarmMate",
    html: `
      <h2>New Order Received! 📦</h2>
      <p>Dear ${farmerName},</p>
      <p>A customer has placed an order for your products on FarmMate.</p>
      
      <h3>Order Details:</h3>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Buyer Name:</strong> ${buyerName}</p>
      
      <h3>Items Ordered:</h3>
      <ul>${itemsList}</ul>
      
      <p>Please prepare and ship the order as soon as possible. Log in to your FarmMate account to view complete order details.</p>
      <p>Best regards,<br>FarmMate Team</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};