// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const orderModel=require("../models/orderModel")

// exports.createPaymentIntent = async (req, res) => {
//   try {
//     const { cart } = req.body;

//     // Calculate total amount in cents
//     const totalAmount = cart.reduce((total, item) => {
//       return total + item.price * 100;
//     }, 0);

//     // Create a PaymentIntent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: totalAmount,
//       currency: "usd",
//       automatic_payment_methods: { enabled: true },
//     });

//     res.status(200).json({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error("Stripe payment error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Payment failed",
//       error: error.message,
//     });
//   }
// };

// exports.placeOrder = async (req, res) => {
//   try {
//     const { cart, payment, buyer, address } = req.body;

//     const newOrder = new orderModel({
//       products: cart.map((item) => item._id),
//       payment,
//       buyer,
//       amount: cart.reduce((total, item) => total + item.price, 0),
//       address,
//     });

//     await newOrder.save();

//     res.status(201).json({
//       success: true,
//       message: "Order placed successfully",
//       order: newOrder,
//     });
//   } catch (error) {
//     console.error("Order placement error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Order failed",
//       error: error.message,
//     });
//   }
// };


// //above working fine basic

// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const orderModel=require("../models/orderModel")

// exports.createPaymentIntent = async (req, res) => {
//   try {
//     const { cart } = req.body;

//     // Calculate total amount in cents
//   const totalAmount = cart.reduce((total, item) => total + item.price * 100, 0);


//     // Create a PaymentIntent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: totalAmount,
//       currency: "usd",
//       automatic_payment_methods: { enabled: true },
//     });

//     res.status(200).json({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (error) {
//     console.error("Stripe payment error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Payment failed",
//       error: error.message,
//     });
//   }
// };

// exports.placeOrder = async (req, res) => {
//   try {
//     const { cart, payment, buyer, address } = req.body;

//     const newOrder = new orderModel({
//       products: cart.map(item => ({
//         productId: item._id,   // optional, good to keep reference
//         name: item.name,
//         price: item.price,
//         quantity: item.quantity || 1,
//       })),
//       payment,
//       buyer:req.user._id,
//       amount: cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0),
//       address,
//       status: 'Processing', // default status or from req.body if you want
//     });

//     await newOrder.save();

//     res.status(201).json({
//       success: true,
//       message: "Order placed successfully",
//       order: newOrder,
//     });
//   } catch (error) {
//     console.error("Order placement error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Order failed",
//       error: error.message,
//     });
//   }
// };

const Order = require("../models/orderModel");
const User = require("../models/userModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
  try {
    const { cart } = req.body;

    // Calculate total amount in cents
  // const totalAmount = cart.reduce((total, item) => total + item.price * 100, 0);

   const amount = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  console.log("Amount to charge:", amount);

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe payment error:", error);
    res.status(500).json({
      success: false,
      message: "Payment failed",
      error: error.message,
    });
  }
};

// exports.placeOrder = async (req, res) => {
//   try {
//     const { cart, payment, address } = req.body;
//     console.log("Request body:", req.body);

//     if (!cart || !Array.isArray(cart)) {
//   return res.status(400).json({ success: false, message: "Cart must be a non-empty array" });
// }

//     // Get full user details
//     const user = await User.findById(req.user._id).select("name email phone");

//     // Validate buyer details
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // Create new order
//     const order = new Order({
//            products: cart.map(item => ({
//         productId: item.productId,  // use 'productId' from request, not '_id'
//         name: item.name,
//         price: item.price,
//         quantity: item.quantity || 1,
//       })),
//       payment,
//       buyer: user._id, // ref to User
//       buyerDetails: {
//         name: user.name,
//         email: user.email,
//         phone: user.phone
//       },
//       amount,
//       address,
//       status: "Processing"
//     });

//     await order.save();

//     res.status(201).json({ success: true, message: "Order placed successfully", order });
//   } catch (error) {
//     console.error("Order placement error:", error);
//     res.status(500).json({ success: false, message: "Order failed", error });
//   }
// };
exports.placeOrder = async (req, res) => {
  try {
    const { cart, payment, address } = req.body;

    const user = await User.findById(req.user._id).select("name email phone");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Calculate total amount on backend
    const amount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const order = new Order({
      products: cart.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
      })),
      // payment,
      payment: {
    success: true,  // 🔥 mark payment as successful
    transactionId: payment?.id || "test_txn_" + Date.now(), // optional
  },
      buyer: user._id,
      buyerDetails: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      amount,
      address,
      status: "Processing",
    });

    await order.save();

    res.status(201).json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ success: false, message: "Order failed", error });
  }
};
