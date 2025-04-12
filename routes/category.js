import {Category} from "../models/category.js";
import express from "express";
import cloudinary from "cloudinary";
import pLimit from "p-limit";
import dotenv from "dotenv";
dotenv.config();

import multer from "multer";
// import pLimit from "p-limit";
import fs from "fs";


var imagesarr=[];

var categoryeditid;
 
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

  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("Files:", req.files); // Should log files

  if(categoryeditid !== undefined){
    const category=await Category.findById(categoryeditid);

    const images=category.images;

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


// cloudinary.v2.config({
//   cloud_name: process.env.cloud_name,
//   api_key: process.env.api_key,
//   api_secret: process.env.api_secret,
// });

const createCategories=(categories,parentid=null)=>{
  const categorylist=[];
  let category;
  if(parentid===null){
    category=categories.filter((cat)=>cat.parentid==undefined);
  }
  else{
    category=categories.filter((cat)=>cat.parentid==parentid);
  }

  for(let cat of category){
    categorylist.push({
      _id:cat._id,
      name:cat.name,
      images:cat.images,
      slug:cat.slug,
      children:createCategories(categories,cat._id)
    })
  }
  return categorylist;
};

router.get("/", async (req, res) => {
  
  // const page= parseInt(req.query.page) || 1;
  // const perpage= parseInt(req.query.perpage) || 5;
  // const totalposts = await Category.countDocuments();
  // const totalpages= Math.ceil(totalposts/perpage);

  // if(page>totalpages){
  //   return res.status(404).json({message:"page not found"})
  // }
  
  // const CategoryList = await Category.find()
  //   .skip((page-1)*perpage)
  //   .limit(perpage)
  //   .exec();

  // if (!CategoryList) {
  //   res.status(500).json({ success: false });
  // }

  // return res.status(200).json({
  //   "CategoryList":CategoryList,
  //   "totalpages":totalpages,
  //   "page":page
  // })

  try{
    const categorylist=await Category.find();

    if(!categorylist){
      res.status(500).json({success:false});
    }

    

    if(categorylist){
      const categorydata=createCategories(categorylist);

      // console.log(categorydata);
      

      return res.status(200).json({
        categorylist:categorydata
      })
    }
  }
  catch(err){
    res.status(500).json({success:false})
  }
  
});

router.get("/count", async (req, res)=>{
  const catcount= await Category.countDocuments({parentid:undefined});
  
  if(!catcount){
    return res.status(500).json({success:false});
  }
  else{
    return res.send({
      catcount:catcount
    })
  }
});

router.get("/subcat/count", async (req, res)=>{
  const catcount= await Category.find();
  const subcatlist=[];

  if(!catcount){
    return res.status(500).json({success:false});
  }
  else{
    

    for(let cat of catcount){
      if(cat.parentid !== undefined){
        subcatlist.push(cat);
      }
    }
  }

    return res.send({
      subcatcount: subcatlist.length,
    })
});

router.get("/:id",async(req,res)=>{

  categoryeditid=req.params.id;

  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(500).json({ message: "The category with the given id is not found!" });
  }
  return res.status(200).send(category);
})

router.post("/create", async (req, res) => {

  // const limit = pLimit(2);
  
  // const imagesToUpload = req.body.images.map((image) => {
  //   return limit(async () => {
  //     const result = await cloudinary.uploader.upload(image);
  //     return result;
  //   });
  // });

  // const uploadstatus = await Promise.all(imagesToUpload);

  // const imgurl = uploadstatus.map((item) => {
  //   return item.secure_url;
  // });

  // if (!uploadstatus) {
  //   return res.status(500).json({
  //     error: "images can not upload",
  //     success: false,
  //   });
  // }

  
  let catobj={};

  if(imagesarr.length>0){
    catobj={
      name:req.body.name,
      images:imagesarr,
      slug:req.body.name
    }
  }else{
    catobj={
      name:req.body.name,
      slug:req.body.name
    }
  }
  if(req.body.parentid){
    catobj.parentid=req.body.parentid;
  }

  let category = new Category(catobj);
 
  if (!category) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }
  category = await category.save();

  imagesarr=[];

  res.status(201).json(category);

});

router.delete("/:id",async(req,res)=>{

    const category = await Category.findById(req.params.id);
    const images = category.images;
  
    if(images.length!==0){
      for(const image of images){
        // fs.unlinkSync(`/Java Script/Complete website/e_commercewebsite/backend/uploads/${image}`);
        fs.unlinkSync(`uploads/${image}`);
      }
    }

  const deletecategory = await Category.findByIdAndDelete(req.params.id);

  if (!deletecategory) {
    res.status(404).json({ message: "category not found!",
      success:false
     });
  }
  return res.status(200).json({
    success:true,
    message:"category deleted successfully"
  });
})
router.put("/:id",async(req,res)=>{
  // const limit = pLimit(2);
  
  // const imagesToUpload = req.body.images.map((image) => {
  //   return limit(async () => {
  //     const result = await cloudinary.uploader.upload(image);
  //     return result;
  //   });
  // });

  // const uploadstatus = await Promise.all(imagesToUpload);

  // const imgurl = uploadstatus.map((item) => {
  //   return item.secure_url;
  // });

  // if (!uploadstatus) {
  //   return res.status(500).json({
  //     error: "images can not upload",
  //     success: false,
  //   });
  // }


  const updatecategory = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      images: imagesarr,
    },
    {new:true}
  );

  if (!updatecategory) {
    res.status(500).json({ message: "category can not be updated!",
      success:false
     });
  }
  res.send(updatecategory)
})

export default router;
 