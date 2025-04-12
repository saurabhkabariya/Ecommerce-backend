import express from "express";
const router = express.Router();
import {productweight} from "../models/productweight.js";


router.get("/", async (req, res) => {

    try{
        const productweightlist=await productweight.find();
        
        if(!productweightlist){
            res.status(500).json({success:false});
        }

        return res.status(200).json(productweightlist);

  
    }
    catch(err){
        res.status(500).json({success:false});
    }

})

router.get("/:id",async(req,res)=>{

  const productweightlist = await productweight.findById(req.params.id);

  if (!productweightlist) {
    res.status(500).json({ message: "The product weight with the given id is not found!" });
  }
  return res.status(200).send(productweightlist);
})



router.post("/create", async (req, res) => {

  let productweightlist = new productweight({
    productweight: req.body.productweight,
  });
 
  if (!productweightlist) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }
  productweightlist = await productweightlist.save();

  res.status(201).json(productweightlist);
});

router.delete("/:id",async(req,res)=>{

  const productweightlist = await productweight.findByIdAndDelete(req.params.id);

  if (!productweightlist) {
    res.status(404).json({ message: "product weight not found!",
      success:false
     });
  }
  return res.status(200).json({
    success:true,
    message:"product weight deleted successfully"
  });
})

router.put("/:id",async(req,res)=>{


  const productweightlist = await productweight.findByIdAndUpdate(
    req.params.id,
    {
      productweight: req.body.productweight,
    },
    {new:true}
  );

  if (!productweightlist) {
    res.status(500).json({ message: "product weight can not be updated!",
      success:false
     });
  }
  res.send(productweightlist);
})




export default router;