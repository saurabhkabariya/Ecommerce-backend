import {cart} from "../models/cart.js";
import express from "express";
import dotenv from "dotenv";
dotenv.config();


const router = express.Router();

router.get("/", async (req, res) => {

  const cartList = await cart.find(req.query);

  if (!cartList) {
    res.status(500).json({ success: false });
  }

  return res.status(200).json(cartList);
  
});

// router.post("/add", async (req, res) => {

//   const cartdata = await cart.findOne({productid:req.body.productid});

//   if(!cartdata){
//     let cartlist = new cart({
//       producttitle: req.body.producttitle,
//       image: req.body.image,
//       rating: req.body.rating,
//       price: req.body.price,
//       quantity: req.body.quantity,
//       subtotal: req.body.subtotal,
//       productid: req.body.productid,
//       userid: req.body.userid,
//     });
   
//     if (!cartlist) {
//       return res.status(500).json({
//         error: err,
//         success: false,
//       });
//     }
//     cartlist = await cartlist.save();
  
//     return res.status(201).json(cartlist);
//   }

//   else{
//     return res.status(409).json({status:false,msg:"Product already added in the cart!"});
//   }

  
// });

router.post("/add", async (req, res) => {
  try {
    const cartdata = await cart.findOne({ productid: req.body.productid, userid: req.body.userid });

    if (!cartdata) {
      let cartlist = new cart({
        producttitle: req.body.producttitle,
        image: req.body.image,
        rating: req.body.rating,
        price: req.body.price,
        quantity: req.body.quantity,
        subtotal: req.body.subtotal,
        productid: req.body.productid,
        userid: req.body.userid,
      });

      cartlist = await cartlist.save();
      return res.status(201).json(cartlist);
    } else {
      return res.status(409).json({ status: false, msg: "Product already added in the cart!" });
    }
  } catch (error) {
    return res.status(500).json({ status: false, msg: "Something went wrong", error });
  }
});

router.delete("/:id",async(req,res)=>{

  const cartlist = await cart.findById(req.params.id);

  if(!cartlist){
    res.status(404).json({error:true,msg:"Product not found!"});
  }

  const deletecart= await cart.findByIdAndDelete(req.params.id);

  if (!deletecart) {
    res.status(404).json({ message: "cart item not found!",
      success:false
     });
  }
  return res.status(200).json({
    success:true,
    message:"cart item deleted successfully"
  });
})
router.put("/:id",async(req,res)=>{
  

  const updatecart = await cart.findByIdAndUpdate(
    req.params.id,
    {
        producttitle: req.body.producttitle,
        image: req.body.image,
        rating: req.body.rating,
        price: req.body.price,
        quantity: req.body.quantity,
        subtotal: req.body.subtotal,
        productid: req.body.productid,
        userid: req.body.userid,
    },
    {new:true}
  );

  if (!updatecart) {
    res.status(500).json({ message: "cart item can not be updated!",
      success:false
     });
  }
  res.send(updatecart)
})


export default router;
 