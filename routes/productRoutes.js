const express = require("express");

const { isadmin, requireSignIn } = require("../middlewares/userMiddleware");
const formidable = require("express-formidable");
const { createProductController, updateProductController, getProductController, getSingleProductController, productPhotoController,
   deleteProductController, productFiltersController, productCountController, productListController, searchProductController,
    realtedProductController, productCategoryController,
    processPaymentController,
    braintreeTokenController,
    brainTreePaymentController,
    createOrderController} = require("../controllers/productController");

const router = express.Router();

// Routes
router.post(
  "/create-product",
  requireSignIn,
  isadmin,
  formidable(),
 createProductController
);

router.put(
  "/update-product/:pid",
  requireSignIn,
  isadmin,
  formidable(),
  updateProductController
);

// Get all products
router.get("/get-product", getProductController);

// Get single product
router.get("/get-product/:slug", getSingleProductController);

// Get product photo
router.get("/product-photo/:pid", productPhotoController);

// Delete product
router.delete("/product/:pid", deleteProductController);


//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);


//search product
router.get("/search/:keyword",searchProductController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug",productCategoryController);

// //payments routes




module.exports = router;
