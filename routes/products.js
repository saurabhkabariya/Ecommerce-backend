import {Category} from "../models/category.js";
import {Product} from "../models/productmodel.js";
import express from "express";
import cloudinary from "cloudinary";
import multer from "multer";
import pLimit from "p-limit";
import fs from "fs";


var imagesarr=[];

var producteditid;
 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/Java Script/Complete website/e_commercewebsite/backend/uploads')
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const upload = multer({ storage: storage })


const router = express.Router();

router.post('/uploadfiles', upload.array("images"), async (req, res) => {

  if(producteditid !== undefined){
      const product=await Product.findById(producteditid);
  
      const images=product.images;
  
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

// router.get("/", async (req, res) => { 

  
//   const page= parseInt(req.query.page) || 1;
//   const perpage=parseInt(req.query.perpage) || 8;
//   const totalposts = await Product.countDocuments();
//   const totalpages= Math.ceil(totalposts/perpage);

//   if(page>totalpages){
//     return res.status(404).json({message:"page not found"})
//   }

//   let ProductList=[];
  
//   if(req.query){
//     if(req.query.minprice !== undefined && req.query.maxprice !== undefined){
//       if(req.query.location !== "All" && req.query.location !== null && req.query.location !== undefined ){
//         ProductList=await Product.find({subcatid:req.query.subcatid,location:req.query.location}).populate("category subcat");
//       }
//       else{
//         ProductList=await Product.find({subcatid:req.query.subcatid}).populate("category subcat");
//       }
  
//       const filteredproducts=ProductList.filter(product =>{
//         if(req.query.minprice && product.price < (+req.query.minprice)){
//           return false;
//         }
//         if(req.query.maxprice && product.price > (+req.query.maxprice)){
//           return false;
//         }
//         return true;
//       })
  
//       if (!ProductList) {
//         res.status(500).json({ success: false });
//       }
//       return res.status(200).json({
//         "ProductList":filteredproducts,
//         "totalpages":totalpages,
//         "page":page
//       })
//     }
//     else if(req.query.page !== undefined || req.query.perpage !== undefined){
//       if(req.query.location !== "All" && req.query.location !== null && req.query.location !== undefined ){
//         ProductList = await Product.find({location:req.query.location}).populate("category subcat").skip((page-1)*perpage)
//         .limit(perpage)
//         .exec();
//       }
//       else{
//         ProductList = await Product.find().populate("category subcat").skip((page-1)*perpage)
//         .limit(perpage)
//         .exec();
  
//       }
  
//       if (!ProductList) {
//         res.status(500).json({ success: false });
//       }
//       return res.status(200).json({
//         "ProductList":ProductList,
//         "totalpages":totalpages,
//         "page":page
//       })
//     }
//     else{
//       // if(req.query.catname !== undefined || req.query.subcatid !== undefined || req.query.rating !== undefined || req.query.location !== "All"){
//       //   ProductList = await Product.find(req.query).populate("category subcat")
    
//       // }
//       // else{
//         if(req.query.location !== "All" && req.query.location !== null && req.query.location !== undefined ){
//           ProductList = await Product.find(req.query).populate("category subcat")
//         }
//         else{
//           if(req.query.catname !== undefined){
//             ProductList = await Product.find({catname:req.query.catname}).populate("category subcat")
//           }
//           else if(req.query.subcatid !== undefined){
//             ProductList = await Product.find({subcatid:req.query.subcatid}).populate("category subcat")
//           }
//           else if(req.query.category !== undefined){
//             ProductList = await Product.find({category:req.query.category}).populate("category subcat")
//           }
//           else{
//             ProductList= await Product.find().populate("category subcat")
//           }
//         }
  
//           // ProductList = await Product.find({catname:req.query.catname}).populate("category subcat")
//           // .skip((page-1)*perpage)
//           // .limit(perpage)
//           // .exec();
  
//           if (!ProductList) {
//             res.status(500).json({ success: false });
//           }
          
//           return res.status(200).json({
//             "ProductList":ProductList,
//             "totalpages":totalpages,
//             "page":page
//           })

//     }
  
//     // }
  
//   }
//   else{
//     ProductList = await Product.find().populate("category subcat")
//       .skip((page-1)*perpage)
//       .limit(perpage)
//       .exec();
//   }
//   // if(req.query.catname !== undefined){
//   //   ProductList = await Product.find({catname:req.query.catname}).populate("category subcat")

//   // }
//   // else{
//   //   ProductList = await Product.find().populate("category subcat")
//   //     .skip((page-1)*perpage)
//   //     .limit(perpage)
//   //     .exec();
//   // }
//   // if(req.query.subcatid !== undefined){
//   //   ProductList = await Product.find({subcatid:req.query.subcatid}).populate("category subcat")
//   // }
//   // else{
//   //   ProductList = await Product.find().populate("category subcat")
//   //     .skip((page-1)*perpage)
//   //     .limit(perpage)
//   //     .exec();
//   // }

//   if (!ProductList) {
//     res.status(500).json({ success: false });
//   }
//   return res.status(200).json({
//     "ProductList":ProductList,
//     "totalpages":totalpages,
//     "page":page
//   })
//   res.send(ProductList);

// });

router.get("/", async (req, res) => {
  try {
    const { page = 1, perpage = 8, minprice, maxprice, location, subcatid, catname, category } = req.query;
    const skip = (page - 1) * perpage;
    const totalPosts = await Product.countDocuments();
    const totalPages = Math.ceil(totalPosts / perpage);

    if (page > totalPages) return res.status(404).json({ message: "Page not found" });

    let query = {};
    if (location && location !== "All") query.location = location;
    if (subcatid) query.subcatid = subcatid;
    if (catname) query.catname = catname;
    if (category) query.category = category;

    let products = await Product.find(query).populate("category subcat");

    // Apply price filtering
    if (minprice || maxprice) {
      products = products.filter(p => {
        if (minprice && p.price < +minprice) return false;
        if (maxprice && p.price > +maxprice) return false;
        return true;
      });
    }

    const paginatedProducts = products.slice(skip, skip + perpage);

    res.status(200).json({
      ProductList: paginatedProducts,
      totalpages: totalPages,
      page: +page
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/count", async (req, res)=>{
  const prodcount= await Product.countDocuments();
  
  if(!prodcount){
    return res.status(500).json({success:false});
  }
  else{
    return res.send({
      prodcount:prodcount
    })
  }
});

router.get("/featured", async (req, res) => {
  let ProductList;
  if(req.query.location !== "All" && req.query.location !== null && req.query.location !== undefined ){
    ProductList = await Product.find({isFeatured:true,location:req.query.location}).populate("category subcat");
  }
  else{
    ProductList = await Product.find({isFeatured:true}).populate("category subcat");
  }

    if (!ProductList) {
      res.status(500).json({ success: false });
    }
    return res.status(200).json(ProductList);
});

router.get("/:id",async(req,res)=>{

  producteditid=req.params.id;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(500).json({ message: "The product with the given id is not found!" });
  }
  return res.status(200).send(product);
})

router.post("/create",upload.single("files"), async (req, res) => {
  
  
  const category = await Category.findById(req.body.category);

  if(!category){
    return res.status(404).send("Invalid category!")
  }

  // const limit = pLimit(2);
    
  //   const imagesToUpload = req.body.images.map((image) => {
  //     return limit(async () => {
  //       const result = await cloudinary.uploader.upload(image);
  //       return result;
  //     });
  //   });
  
  //   const uploadstatus = await Promise.all(imagesToUpload);
  
  //   const imgurl = uploadstatus.map((item) => {
  //     return item.secure_url;
  //   });
  
  //   if (!uploadstatus) {
  //     return res.status(500).json({
  //       error: "images can not upload",
  //       success: false,
  //     });
  //   }

  let product=new Product({
    name:req.body.name,
    subcat:req.body.subcat,
    description:req.body.description,
    images:imagesarr,
    brand:req.body.brand,
    price:req.body.price,
    oldprice:req.body.oldprice,
    category:req.body.category,
    catname:req.body.catname,
    subcatname:req.body.subcatname,
    subcatid:req.body.subcatid,
    countInStock:req.body.countInStock,
    rating:req.body.rating,
    isFeatured:req.body.isFeatured,
    discount:req.body.discount,
    productrams:req.body.productrams,
    productsize:req.body.productsize,
    productweight:req.body.productweight,
    location:req.body.location !== "" ? req.body.location : "All",
    dateCreated:req.body.dateCreated,
  })

  product=await product.save()

  if (!product) {
    res.status(500).json({ 
        error:err,
        success: false });
  }
  res.status(201).json(product);
});

router.delete("/:id",async(req,res)=>{

  const product = await Product.findById(req.params.id);
  const images = product.images;

  if(images.length!==0){
    for(const image of images){
      fs.unlinkSync(`uploads/${image}`);
    }
  }

  const deleteproduct = await Product.findByIdAndDelete(req.params.id);

  if (!deleteproduct) {
    res.status(404).json({ message: "product not found!",
      success:false
     });
  }
  return res.status(200).json({
    success:true,
    message:"productdeleted successfully"
  });
})

router.put("/:id",async(req,res)=>{

  // const limit = pLimit(2);
    
  //   const imagesToUpload = req.body.images.map((image) => {
  //     return limit(async () => {
  //       const result = await cloudinary.uploader.upload(image);
  //       return result;
  //     });
  //   });
  
  //   const uploadstatus = await Promise.all(imagesToUpload).catch((error) => {
  //     return res.status(500).json({ error: "Images could not be uploaded", success: false });
  //   });
  
  //   const imgurl = uploadstatus.map((item) => {
  //     return item.secure_url;
  //   });
  
  //   if (!uploadstatus) {
  //     return res.status(500).json({
  //       error: "images can not upload",
  //       success: false,
  //     });
  //   }

  const updateproduct = await Product.findByIdAndUpdate(
    req.params.id,
    {
        name:req.body.name,
        subcat:req.body.subcat,
        description:req.body.description,
        images:imagesarr,
        brand:req.body.brand,
        price:req.body.price,
        oldprice:req.body.oldprice,
        category:req.body.category,
        catname:req.body.catname,
        subcatname:req.body.subcatname,
        subcatid:req.body.subcatid,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        isFeatured:req.body.isFeatured,
        discount:req.body.discount,
        productrams:req.body.productrams,
        productsize:req.body.productsize,
        productweight:req.body.productweight,
        location:req.body.location,
        dateCreated:req.body.dateCreated,
    },
    {new:true}
  );

  if (!updateproduct) {
    res.status(404).json({ message: "product can not be updated!",
      success:false
     });
  }
  res.status(200).json({
    message:"the product is updated",
    success:true
  });

})

export default router;