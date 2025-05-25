const express=require('express')
const {registerController,loginController,testController, updateProfileController,getOrdersController, orderStatusController} = require('../controllers/userController');
// const connectDB=require("./config/db");
const {requireSignIn,isadmin} =require('../middlewares/userMiddleware');
// const { trusted } = require('mongoose');


//router object
const router=express.Router()

router.post('/register',registerController);

router.post('/login',loginController);
//for testcontroller , given protected routes 
//this will give unauthorized , when check is admin 
//bcz when role ==0 , they are not admin
router.get('/test',requireSignIn,isadmin,testController);


//protected user routes
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true})
})
//protected admin route
router.get('/admin-auth',requireSignIn,isadmin ,(req,res) =>{
    res.status(200).send({ok:true})
})


router.put('/profile',requireSignIn,updateProfileController)

//orders
// router.get("/orders", requireSignIn, getOrdersController);
router.get("/orders", requireSignIn,getOrdersController);



// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isadmin,
  orderStatusController
);



module.exports=router;

