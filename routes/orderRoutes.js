


// const express = require("express");
// const router = express.Router();
// const { createPaymentIntent ,placeOrder} = require("../controllers/orderController");

// router.post("/create-payment-intent", createPaymentIntent);

// router.post("/place-order", placeOrder);



// module.exports = router;




const express = require("express");
const router = express.Router();
const { createPaymentIntent ,placeOrder} = require("../controllers/orderController");
const { requireSignIn } = require("../middlewares/userMiddleware");

router.post("/create-payment-intent", createPaymentIntent);

router.post("/place-order", requireSignIn,placeOrder);



module.exports = router;


