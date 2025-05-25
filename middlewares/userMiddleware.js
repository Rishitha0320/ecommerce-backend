// const jwt =require('jsonwebtoken');
// const userModel = require('../models/userModel');
// //in middleware , i ahev req,res , next(extra in middleware)
// const requireSignIn =async(req,res,next)=>{
// try{
//     const decode=jwt.verify(
//               req.headers.authorization,
//               process.env.JWT_SECRET
//     );
//     req.user=decode;
//     next();//execute next code
// }
//     catch(error){
//             console.log(error)
//     }
// }

// //admin access

// const isadmin= async(req,res,next)=>{
//     try{
//         const user=await userModel.findById(req.user._id);
//         if(user.role!==1){
//                return res.status(401).send({
//                 success:false,
//                 message:"You are not admin , unauthorized access"
//                });
//         }
//         else{
//             next();
//         }
//     }
//     catch(error){
//             console.log(error);
//             res.status(401).send({
//                 success:false,
//                 error,
//                 message:"You are not admin , unauthorized access"
//             })
        
//     }
// }


// module.exports={requireSignIn,isadmin};
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const requireSignIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    const token = authHeader.split(" ")[1]; // Get token after "Bearer"
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.log("JWT Error:", error);
    return res.status(401).send({
      success: false,
      message: "Invalid or expired token",
      error,
    });
  }
};

const isadmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "You are not admin, unauthorized access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "You are not admin, unauthorized access",
    });
  }
};

module.exports = { requireSignIn, isadmin };
