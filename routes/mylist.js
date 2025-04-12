import {mylist} from "../models/mylist.js";
import express from "express";
import dotenv from "dotenv";
dotenv.config();


const router = express.Router();

router.get("/", async (req, res) => {
  let wishList=[];

    wishList = await mylist.find(req.query);


  if (!wishList) {
    res.status(500).json({ success: false });
  }

  return res.status(200).json(wishList);
  
});

router.post("/add", async (req, res) => {
  try {
    const wishListdata = await mylist.findOne({ productid: req.body.productid, userid: req.body.userid });

    if (!wishListdata) {
      let wishList = new mylist({
        producttitle: req.body.producttitle,
        image: req.body.image,
        rating: req.body.rating,
        price: req.body.price,
        productid: req.body.productid,
        userid: req.body.userid,
      });

      wishList = await wishList.save();
      return res.status(201).json(wishList);
    } else {
      return res.status(409).json({ status: false, msg: "Product already added in the list!" });
    }
  } catch (error) {
    return res.status(500).json({ status: false, msg: "Something went wrong", error });
  }
});

router.delete("/:id",async(req,res)=>{

  const wishList = await mylist.findById(req.params.id);

  if(!wishList){
    res.status(404).json({error:true,msg:"Product not found!"});
  }

  const deletewishlist= await mylist.findByIdAndDelete(req.params.id);

  if (!deletewishlist) {
    res.status(404).json({ message: "list item not found!",
      success:false
     });
  }
  return res.status(200).json({
    success:true,
    message:"list item deleted successfully"
  });
})
router.put("/:id",async(req,res)=>{
  

  const updatewishlist = await mylist.findByIdAndUpdate(
    req.params.id,
    {
        producttitle: req.body.producttitle,
        image: req.body.image,
        rating: req.body.rating,
        price: req.body.price,
        productid: req.body.productid,
        userid: req.body.userid,
    },
    {new:true}
  );

  if (!updatewishlist) {
    res.status(500).json({ message: "list item can not be updated!",
      success:false
     });
  }
  res.send(updatewishlist)
})


export default router;
 