import express from "express";
const router = express.Router();

import {Subcat} from "../models/subcat.js";
import {Category} from "../models/category.js";

router.get("/", async (req, res) => {

    try{
        // const subcat=await Subcat.find().populate("cat");

        // if(!subcat){
        //     res.status(404).json({success:false});
        // }
        // res.status(200).json(subcat);

          
  const page= parseInt(req.query.page) || 1;
  const perpage=5;
  const totalposts = await Subcat.countDocuments();
  const totalpages= Math.ceil(totalposts/perpage);

  if(page>totalpages){
    return res.status(404).json({message:"page not found"})
  }

  let subcatlist;

  if (req.query.page !== undefined && req.query.perpage !== undefined){
    subcatlist = await Subcat.find().populate("cat")
    .skip((page-1)*perpage)
    .limit(perpage)
    .exec();
  }
  else{
    subcatlist = await Subcat.find().populate("cat");
  }


  
  

  if (!subcatlist) {
    res.status(500).json({ success: false });
  }

  return res.status(200).json({
    "subcatlist":subcatlist,
    "totalpages":totalpages,
    "page":page
  })
  
    }
    catch(err){
        res.status(500).json({success:false});
    }

})

router.get("/:id",async(req,res)=>{

//   categoryeditid=req.params.id;

  const subcat = await Subcat.findById(req.params.id);

  if (!subcat) {
    res.status(500).json({ message: "The sub category with the given id is not found!" });
  }
  return res.status(200).send(subcat);
})

router.post("/create", async (req, res) => {

    // const cat = await Category.findById(req.body.cat);
    
    //   if(!cat){
    //     return res.status(404).send("Invalid category!")
    //   }

  let subcat = new Subcat({
    cat: req.body.cat,
    subcat: req.body.subcat,
  });
 
  if (!subcat) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }
  subcat = await subcat.save();

  res.status(201).json(subcat);
});

router.delete("/:id",async(req,res)=>{

  const deletesubcategory = await Subcat.findByIdAndDelete(req.params.id);

  if (!deletesubcategory) {
    res.status(404).json({ message: "sub category not found!",
      success:false
     });
  }
  return res.status(200).json({
    success:true,
    message:"sub category deleted successfully"
  });
})

router.put("/:id",async(req,res)=>{


  const updatesubcategory = await Subcat.findByIdAndUpdate(
    req.params.id,
    {
      cat: req.body.cat,
      subcat: req.body.subcat,
    },
    {new:true}
  );

  if (!updatesubcategory) {
    res.status(500).json({ message: "sub category can not be updated!",
      success:false
     });
  }
  res.send(updatesubcategory);
})


export default router;