import express from "express";
import { productreviews } from "../models/productreviews.js";
const router = express.Router();


router.get("/", async (req, res) => {
    let reviews=[];
    try{
      if(req.query.productid !== undefined && req.query.productid !== null && req.query.productid !== ""){
        reviews= await productreviews.find({productid:req.query.productid});
      }
      else{
        reviews=await productreviews.find();
      }

      if(!reviews){
        res.status(500).json({success:false});
      }

      return res.status(200).json(reviews);
        
    }
    catch(err){
        res.status(500).json({success:false});
    }
         
})

router.get("/:id",async(req,res)=>{

  const review = await productreviews.findById(req.params.id);

  if (!review) {
    res.status(500).json({ message: "The review with the given id is not found!" });
  }
  return res.status(200).send(review);
})

router.post("/add", async (req, res) => {

  let review = new productreviews({
    productid: req.body.productid,
    customername: req.body.customername,
    customerid: req.body.customerid,
    review: req.body.review,
    customerrating: req.body.customerrating,
  });
 
  if (!review) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }
  review = await review.save();

  res.status(201).json(review);
});

router.delete("/:id",async(req,res)=>{

  const deletereview = await productreviews.findByIdAndDelete(req.params.id);

  if (!deletereview) {
    res.status(404).json({ message: "review not found!",
      success:false
     });
  }
  return res.status(200).json({
    success:true,
    message:"review deleted successfully"
  });
})

router.put("/:id",async(req,res)=>{


  const updatereview = await productreviews.findByIdAndUpdate(
    req.params.id,
    {
        productid: req.body.productid,
        customername: req.body.customername,
        customerid: req.body.customerid,
        review: req.body.review,
        customerrating: req.body.customerrating,
    },
    {new:true}
  );

  if (!updatereview) {
    res.status(500).json({ message: "review can not be updated!",
      success:false
     });
  }
  res.send(updatereview);
})


export default router;