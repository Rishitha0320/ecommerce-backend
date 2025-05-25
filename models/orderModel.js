// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema(
//   {
//     products: [
//       {
//         type: mongoose.ObjectId,
//         ref: "Products",

//       },
//     ],
//     payment: {
//       id: String,       // Stripe paymentIntent ID
//       status: String,   // succeeded, pending, etc.
//       type: Object,     // card, upi, etc.
//     },
//     buyer: {
//       type: mongoose.ObjectId,
//       ref: "Users",
//     },
//     amount: Number,
//     status: {
//       type: String,
//       default: "Processing",
//       enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
//     },
//     address: String, // optional, useful for delivery
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Order", orderSchema);

// //above is correct working code 

// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' }, // optional, if you want to keep reference too
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   quantity: { type: Number, default: 1 },
// });

// const orderSchema = new mongoose.Schema(
//   {
//     products: [productSchema],
//     payment: { type: Object, required: true },
//     buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
//     amount: { type: Number, required: true },
//     address: { type: String, required: true },
//     status: { type: String, default: 'Processing' },
//   },
//   { timestamps: true }
// );

// const orderModel = mongoose.model('Order', orderSchema);
// module.exports = orderModel;

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true
        },
        name: String,
        price: Number,
        quantity: Number
      }
    ],
    payment: {
      // id: String,
      // status: String
    success: { type: Boolean, default: false },
  transactionId: String,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    buyerDetails: {
      name: String,
      email: String,
      phone: String
    },
    amount: {
      type: Number,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: "Processing"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
