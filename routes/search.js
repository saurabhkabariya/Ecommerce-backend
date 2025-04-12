
import {Product} from "../models/productmodel.js";
import express from "express";

const router = express.Router();

router.get("/", async (req, res) => { 

  try{
    const query=req.query.q;
    if(!query){
        return res.status(400).json({msg:"query is required!"});
    }

    const items= await Product.find({
        $or:[
            {name:{$regex:query,$options:'i'}},
            {brand:{$regex:query,$options:'i'}},
            {catname:{$regex:query,$options:'i'}},
        ]
    });
    res.json(items);
  }
  catch(err){
    res.status(500).json({msg:"server error"});
  }
});
  
export default router;