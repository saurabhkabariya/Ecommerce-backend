import express from "express";
const router = express.Router();
import {productrams} from "../models/productrams.js";


router.get("/", async (req, res) => {

    try{
        const productramslist=await productrams.find();
        
        if(!productramslist){
            res.status(500).json({success:false});
        }

        return res.status(200).json(productramslist);

  
    }
    catch(err){
        res.status(500).json({success:false});
    }

})

router.get("/:id",async(req,res)=>{

  const productramslist = await productrams.findById(req.params.id);

  if (!productramslist) {
    res.status(500).json({ message: "The product ram with the given id is not found!" });
  }
  return res.status(200).send(productramslist);
})


router.post("/create", async (req, res) => {

  let productramslist = new productrams({
    productrams: req.body.productrams,
  });
 
  if (!productramslist) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }
  productramslist = await productramslist.save();

  res.status(201).json(productramslist);
});

router.delete("/:id",async(req,res)=>{

  const productramslist = await productrams.findByIdAndDelete(req.params.id);

  if (!productramslist) {
    res.status(404).json({ message: "product rams not found!",
      success:false
     });
  }
  return res.status(200).json({
    success:true,
    message:"product rams deleted successfully"
  });
})

router.put("/:id",async(req,res)=>{


  const productramslist = await productrams.findByIdAndUpdate(
    req.params.id,
    {
      productrams: req.body.productrams,
    },
    {new:true}
  );

  if (!productramslist) {
    res.status(500).json({ message: "product ram can not be updated!",
      success:false
     });
  }
  res.send(productramslist);
})


export default router;