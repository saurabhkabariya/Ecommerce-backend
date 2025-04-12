import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
// import authjwt from "./helper/jwt.js"
dotenv.config();


const app = express()

app.use(cors())
app.options('*',cors())
// app.use(cors({
//     origin: "http://localhost:3000",
//     credentials: true,
//     allowedHeaders: ["Content-Type", "Authorization"]
// }));


//middleware
app.use(bodyParser.json())
app.use(express.json())
// app.use(authjwt()) 

//Routes
import userRoutes from "./routes/user.js";
import CategoryRoutes from "./routes/category.js";
import SubCatRoutes from "./routes/subcat.js";
import ProductRoutes from "./routes/products.js";
import ProductramsRoutes from "./routes/productrams.js";
import ProductsizeRoutes from "./routes/productsize.js";
import ProductweightRoutes from "./routes/productweight.js";
import CartRoutes from "./routes/cart.js";
import productreviews from "./routes/productreviews.js";
import mylist from "./routes/mylist.js";
import orders from "./routes/orders.js";
import homebanner from "./routes/homebanner.js";
import search from "./routes/search.js";

app.use('/uploads',express.static("uploads"));
app.use('/api/category',CategoryRoutes)
app.use('/api/subcat',SubCatRoutes)
app.use('/api/products',ProductRoutes)
app.use('/api/productrams',ProductramsRoutes)
app.use('/api/productsize',ProductsizeRoutes)
app.use('/api/productweight',ProductweightRoutes)
app.use('/api/user',userRoutes)
app.use('/api/cart',CartRoutes)
app.use('/api/productreviews',productreviews) 
app.use('/api/mylist',mylist) 
app.use('/api/orders',orders) 
app.use('/api/homebanner',homebanner) 
app.use('/api/search',search) 

//database
mongoose.connect(process.env.Connection_string,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{console.log('Connected to DB');
    app.listen(process.env.PORT,()=>{
        console.log(`server on port ${process.env.PORT}`);
          
    })
}).catch(()=>{console.log('Connection Failed');
})

process.on("unhandledRejection", (error) => {
    console.error("Unhandled Rejection:", error);
});
