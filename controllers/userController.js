const userModel = require('../models/userModel')
// const user
const {hashPassword,comparePassword}=require('../helpers/userHelper')
const jwt = require ('jsonwebtoken');

const registerController=async(req,res)=>{
try{

    const {name,email,password,phone,address}=req.body
    //validations
    if(!name){
        return res.send({message:'name is required'})
    }
    if(!email){
        return res.send({message:'email is required'})
    }
    if(!password){
        return res.send({message:'password is required'})
    }
    if(!phone){
        return res.send({message:'phone no is required'})
    }
    if(!address){
        return res.send({message:'address is required'})
    }
//check for existing user
const existingUser= await userModel.findOne({email})
if(existingUser){
    return res.status(409).send({
        success:false,
        message:'user already registered',
        
    });
}
const hashedPassword=await hashPassword(password)
const user = await new userModel({
    name,email,phone,address,password:hashedPassword}).save()

    res.status(201).send({
      success:true,
      message:"user registered successfull",
      user
})
}
catch(error){
  console.log("Register error:", error.message);
  res.status(500).send({
    success:false,
    message:'error in registration',
    error:error.message
  });
}


};


//post method 

const loginController=async(req,res)=>{
  
try{


    const {email,password}=req.body

    if(!email || !password){
        return res.status(404).send({
            success:false,
            message:'email and password are required',
        })
    }
    //check user 
    const user= await userModel.findOne({email})
    if(!user){
       return res.status(404).send({
        success:false,
        message:'user not found',
       })
    }
    const match=await comparePassword(password,user.password)
     if(!match){
        res.status(200).send({
            success:false,
            message:'password is incorrect',
        })
     }
    //token creation
    const token= await jwt.sign({_id:user._id},process.env.JWT_SECRET,{
        expiresIn:'31d',
    });

    res.status(200).send({
        success:true,
        message:'login successful',
        user:{
            name:user.name,
            email:user.email,
            phone:user.phone,
            address:user.address,
            role:user.role,
        },
        token:token
    
    });
}
catch(error){
   console.log(error)
   res.status(500).send({
    success:false,
    message:"error in login",
    error
   })
}



}

//to check if this is working
const testController=(req,res)=>{
    
    res.send("protected route");

};

const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);

    // password validation
    if (password && password.length < 6) {
      return res.json({ error: "Password is required and must be at least 6 characters long" });
    }

    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while updating profile",
      error,
    });
  }
};

// const orderModel = require('../models/orderModel');

// Get all orders
const Order = require("../models/orderModel");
// const { get } = require('../routes/userRoutes');

// const getOrdersController = async (req, res) => {
//   try {
//     const orders = await Order.find({})
//       .populate("products.productId", "-photo") // Populate productId from products array
//       .populate("buyer", "name") // Populate buyer with name only
//       .sort({ createdAt: -1 }); // Sort by newest first

//     res.status(200).json({
//       success: true,
//       message: "Orders fetched successfully",
//       orders,
//     });
//   } catch (error) {
//     console.error("Error while getting orders:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error while getting orders",
//       error: error.message,
//     });
//   }
// };
const getOrdersController = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("products.productId") // DO NOT exclude photo
      .populate("buyer", "name")
      .sort({ createdAt: -1 });

    // Convert photo buffer to base64 string
    const ordersWithPhotos = orders.map(order => {
      const productsWithPhotos = order.products.map(item => {
        const product = item.productId;
        let photoBase64 = null;

        if (product?.photo?.data) {
          photoBase64 = product.photo.data.toString("base64");
        }

        return {
          ...item.toObject(),
          productId: {
            ...product.toObject(),
            photo: {
              data: photoBase64,
              contentType: product.photo.contentType
            }
          }
        };
      });

      return {
        ...order.toObject(),
        products: productsWithPhotos
      };
    });

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders: ordersWithPhotos,
    });
  } catch (error) {
    console.error("Error while getting orders:", error);
    res.status(500).json({
      success: false,
      message: "Error while getting orders",
      error: error.message,
    });
  }
};


// Update order status
// const orderStatusController = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;
//     const orders = await Order.findByIdAndUpdate(
//       orderId,
//       { status },
//       { new: true }
//     );
//     res.json(orders);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error while updating order",
//       error,
//     });
//   }
// };
const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).send({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).send({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};

 
// export default {registerController};
module.exports={registerController,loginController,testController,updateProfileController,getOrdersController,orderStatusController};
