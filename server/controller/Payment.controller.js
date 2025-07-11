const axios = require("axios");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
require("dotenv").config();

const store_id = process.env.SSLC_STORE_ID; // SSLCommerz Store ID
const store_passwd = process.env.SSLC_STORE_PASSWORD; // SSLCommerz Store Password
const is_sandbox = true; // sandbox or live
// ssl commerz initiate payment
exports.initiatePayment = async (req, res) => {
  const { total_amount, currency = "BDT", user, ship_add1, id } = req.body;
  let cus_name;
  let cus_email;
  let cus_phone;
  if (user) {
    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }
    cus_name = existingUser.name;
    cus_email = existingUser.email;
    cus_phone = existingUser.phone;
  }
  // SSLCommerz sandbox/live API URL
  const url = is_sandbox
    ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
    : "https://securepay.sslcommerz.com/gwprocess/v4/api.php";
  const host = `${process.env.BASE_URL}/api`;
  // Payment data according to SSLCommerz API documentation
  const postData = {
    store_id: store_id,
    store_passwd: store_passwd,
    total_amount: total_amount,
    currency: currency,
    tran_id: id, // ইউনিক ট্রানজেকশন আইডি
    success_url: `${host}/payment/response`,
    fail_url: `${host}/payment/response`,
    cancel_url: `${host}/payment/response`,
    ipn_url: "", // IPN URL দিতে পারো (optional)
    shipping_method: "NO",
    product_name: "Test Product",
    product_category: "Test Category",
    product_profile: "general",
    cus_name: cus_name,
    cus_email: cus_email,
    cus_add1: ship_add1,
    cus_phone: cus_phone,
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    // আরও প্রয়োজন অনুযায়ী ডাটা যোগ করতে পারো
  };

  try {
    // SSLCommerz expects form-urlencoded data
    const params = new URLSearchParams(postData).toString();

    const response = await axios.post(url, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.data && response.data.GatewayPageURL) {
      res.status(200).json({ payment_url: response.data.GatewayPageURL });
    } else {
      console.error("GatewayPageURL missing in response", response.data);
      res.status(500).json({ error: "No GatewayPageURL found" });
    }
  } catch (error) {
    console.error(
      "SSLCommerz API error:",
      error.response?.data || error.message || error
    );
    res.status(500).json({ error: "Payment initialization failed" });
  }
};

exports.response = async (req, res) => {
  const { status, tran_id } = req.body;
  if (status === "VALID") {
    const order = await Order.findById(tran_id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paid = true;
    await order.save();

    return res.redirect(`${process.env.FRONTEND_URL}/payment-success`);
  } else if (status === "FAILED") {
    return res.redirect(`${process.env.FRONTEND_URL}/payment-fail`);
  } else {
    return res.redirect(`${process.env.FRONTEND_URL}/payment-cancel`);
  }
};
// stripe initiate payment

exports.createCheckoutSession = async (req, res) => {
  try {
    const {
      total_amount,
      currency = "BDT",
      user,
      ship_add1,
      products,
      id,
    } = req.body;

    if (!total_amount || isNaN(total_amount)) {
      return res.status(400).json({ message: "Invalid total_amount" });
    }

    // Normalize products to array of product IDs
    let productIds = [];
    if (Array.isArray(products)) {
      productIds = products.map((item) => item.product);
    } else if (products && typeof products === "object" && products.product) {
      productIds = [products.product];
    } else if (typeof products === "string") {
      productIds = [products];
    } else {
      productIds = [];
    }

    // Determine product name
    let productName = "Total Purchase";
    if (productIds.length === 1) {
      productName = `Product ID: ${productIds[0]}`;
    } else if (productIds.length > 1) {
      productName = `Multiple Products (${productIds.length})`;
    }

    // Get user email if user is logged in
    let cus_email = "guest@example.com";
    if (user) {
      const existingUser = await User.findById(user);
      if (!existingUser) {
        return res.status(400).json({ message: "User not found" });
      }
      cus_email = existingUser.email;
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: cus_email,
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: productName,
            },
            unit_amount: total_amount * 100, // cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      metadata: {
        user_id: user || "guest",
        address: ship_add1 || "N/A",
        total_amount: total_amount,
        products: JSON.stringify(productIds),
        order_id: id,
      },
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// stripe to db update
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // শুধু checkout.session.completed ইভেন্টে কাজ করবো
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const orderId = session.metadata.order_id;

    if (orderId) {
      try {
        const order = await Order.findById(orderId);
        if (!order) {
          return res.status(404).send("Order not found");
        }

        order.paid = true;
        await order.save();
      } catch (error) {
        console.error("Error updating order payment status:", error);
        return res.status(500).send("Internal Server Error");
      }
    }
  }

  // Stripe-কে 200 response দিতে হবে, না হলে বারবার রিট্রাই করবে
  res.json({ received: true });
};
