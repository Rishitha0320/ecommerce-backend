//express ->for rest api
const express=require('express');
const colors=require('colors');
const dotenv=require('dotenv');
const connectDB=require("./config/db");
const morgan=require('morgan');
const userRoutes=require('./routes/userRoutes');
const cors=require('cors')
const CategoryRoutes= require('./routes/CategoryRoutes')
const productRoutes= require('./routes/productRoutes')
const orderRoutes=require('./routes/orderRoutes')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');


// const path = require('path'); // <-- add this
//configure env
// dotenv.config();

require('dotenv').config();
console.log('PORT:', process.env.PORT);
console.log('DEV_MODE:', process.env.DEV_MODE);
console.log('MONGO_URL:', process.env.MONGO_URL);
console.log('JWT_SECRET:', process.env.JWT_SECRET);



connectDB();


const app=express();
app.use(express.json({ limit: '10mb' }));
app.use(cors({
      origin: "http://localhost:3000", // React frontend URL
      credentials: true,
}


));

app.use(express.urlencoded({ extended: true }));

//routes
app.use('/api/v1/auth',userRoutes);
app.use('/api/v1/category',CategoryRoutes);
app.use('/api/v1/product',productRoutes);
app.use('/api/v1/order',orderRoutes);




//middleware

app.use(morgan('dev'))






app.get('/',(req,res)=>{
    res.send("<h1>welcome to my ecommerece app</h1>")
        // message:'welcome to e-commerce app'
        
});

const PORT=process.env.PORT||8080;

// // Serve static files from the React frontend build folder
// app.use(express.static(path.join(__dirname, 'frontend/build')));

// // For any other routes, serve index.html
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
// });



app.listen(PORT,()=>{
    console.log(
        `server running on port ${PORT}`
    );
})