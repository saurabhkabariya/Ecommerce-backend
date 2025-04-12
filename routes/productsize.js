import express from "express";
const router = express.Router();
import {productsize} from "../models/productsize.js";


router.get("/", async (req, res) => {

    try{
        const productsizelist=await productsize.find();
        
        if(!productsizelist){
            res.status(500).json({success:false});
        }

        return res.status(200).json(productsizelist);

  
    }
    catch(err){
        res.status(500).json({success:false});
    }

})

router.get("/:id",async(req,res)=>{

  const productsizelist = await productsize.findById(req.params.id);

  if (!productsizelist) {
    res.status(500).json({ message: "The product size with the given id is not found!" });
  }
  return res.status(200).send(productsizelist);
})


router.post("/create", async (req, res) => {

  let productsizelist = new productsize({
    productsize: req.body.productsize,
  });
 
  if (!productsizelist) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }
  productsizelist = await productsizelist.save();

  res.status(201).json(productsizelist);
});

router.delete("/:id",async(req,res)=>{

  const productsizelist = await productsize.findByIdAndDelete(req.params.id);

  if (!productsizelist) {
    res.status(404).json({ message: "product size not found!",
      success:false
     });
  }
  return res.status(200).json({
    success:true,
    message:"product size deleted successfully"
  });
})

router.put("/:id",async(req,res)=>{


  const productsizelist = await productsize.findByIdAndUpdate(
    req.params.id,
    {
      productsize: req.body.productsize,
    },
    {new:true}
  );

  if (!productsizelist) {
    res.status(500).json({ message: "product size can not be updated!",
      success:false
     });
  }
  res.send(productsizelist);
})


export default router;