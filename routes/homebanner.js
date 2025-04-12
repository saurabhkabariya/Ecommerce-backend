import {homebanner} from "../models/homebanner.js";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

import multer from "multer";
// import pLimit from "p-limit";
import fs from "fs";


var imagesarr={};

var homebannereditid;
 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/Java Script/Complete website/e_commercewebsite/backend/uploads');
    // cb(null, '/uploads')
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const upload = multer({ storage: storage })


const router = express.Router();

router.post('/uploadfiles', upload.array("images"), async (req, res) => {

  if(homebannereditid !== undefined){
    const banner=await homebanner.findById(homebannereditid);

    const images=banner.images;

    if(images.length !== 0){
      for(const image of images){
        fs.unlinkSync(`uploads/${image}`);
      }
    }
  }

  imagesarr = [];
  const files= req.files;

  

  for(let i=0;i<files.length;i++){
    imagesarr.push(files[i].filename);
  }

  res.json({success:true,images:imagesarr});
})


router.get("/", async (req, res) => {
  const homebannerlist = await homebanner.find();

  if (!homebannerlist) {
    res.status(500).json({ success: false });
  }

  return res.status(200).json(homebannerlist);
});

router.get("/:id",async(req,res)=>{

  homebannereditid=req.params.id;

  const banner = await homebanner.findById(req.params.id);

  if (!banner) {
    res.status(500).json({ message: "The banner with the given id is not found!" });
  }
  return res.status(200).send(banner);
})

router.post("/create", async (req, res) => {

  let bannerlist = new homebanner({
    images: imagesarr
  });
 
  if (!bannerlist) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }
  bannerlist = await bannerlist.save();

  res.status(201).json(bannerlist);
});

router.delete("/:id",async(req,res)=>{

    const bannerdelete = await homebanner.findById(req.params.id);
    const images = bannerdelete.images;
  
    if(images.length!==0){
      for(const image of images){
        // fs.unlinkSync(`/Java Script/Complete website/e_commercewebsite/backend/uploads/${image}`);
        fs.unlinkSync(`uploads/${image}`);
      }
    }

  const bannerdeletelist = await homebanner.findByIdAndDelete(req.params.id);

  if (!bannerdeletelist) {
    res.status(404).json({ message: "banner not found!",
      success:false
     });
  }
  return res.status(200).json({
    success:true,
    message:"banner deleted successfully"
  });
})
router.put("/:id",async(req,res)=>{

  const updatehomebanner = await homebanner.findByIdAndUpdate(
    req.params.id,
    {
      images: imagesarr,
    },
    {new:true}
  );

  if (!updatehomebanner) {
    res.status(500).json({ message: "banner can not be updated!",
      success:false
     });
  }
  res.send(updatehomebanner)
})

export default router;
 