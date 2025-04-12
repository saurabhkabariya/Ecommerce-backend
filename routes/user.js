// import {user} from "../models/user.js";
// import express from "express";
// const router = express.Router();
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// import multer from "multer";
// import fs from "fs";


// var imagesarr=[];

// var usereditid;

 
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '/Java Script/Complete website/e_commercewebsite/backend/uploads');
//     // cb(null, '/uploads')
//   },
//   filename: function (req, file, cb) {
//     // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, `${Date.now()}_${file.originalname}`)
//   }
// })

// const upload = multer({ storage: storage })


// router.post('/uploadfiles', upload.array("images"), async (req, res) => {

//   if(usereditid !== undefined){
//     const userimg=await user.findById(usereditid);
    

//     const images=userimg.images;

//     if(images.length !== 0){
//       for(const image of images){
//         fs.unlinkSync(`uploads/${image}`);
//       }
//     }
//   }

//   imagesarr = [];
//   const files= req.files;

  

//   for(let i=0;i<files.length;i++){
//     imagesarr.push(files[i].filename);
//   }

//   res.json({success:true,images:imagesarr});
// })




// router.post('/signup',async(req,res)=>{
//     const {name,phone,email,password}=req.body;
//     try{
//         const existinguser=await user.findOne({email:email});
//         const existinguserbyphone=await user.findOne({phone:phone});

//         if(existinguser && existinguserbyphone){
//             res.status(400).json({
//                 error:true,
//                 msg:"user already exist!",
//             })
//         }

//         const hashpassword=await bcrypt.hash(password,10);
//         const result= await user.create({
//             name:name,
//             phone:phone,
//             email:email,
//             password:hashpassword,
//         })

//         const token=jwt.sign({email:result.email, id:result._id},process.env.JSON_WEB_TOKEN_SECRET_KEY);

//         res.status(200).json({
//             user:result,
//             token:token,
//             error:false
//         })
//     }
//     catch(err){
//         console.log('error:',err);
        
//         res.status(500).json({error:true,msg:"something went wrong!"})
//     }
// })
 
// router.post("/signin",async(req,res)=>{
//     const {email,password}=req.body;

//     try{
//         const existinguser=await user.findOne({email:email});

//         if(!existinguser){
//             res.status(404).json({
//                 error:true,
//                 msg:"user not found!",
//             })
//         }

//         const matchpassword=await bcrypt.compare(password,existinguser.password);
//         if(!matchpassword){
//             return res.status(400).json({error:true,msg:"Invalid credentials!"})
//         }

//         const token=jwt.sign({email:existinguser.email, id:existinguser._id},process.env.JSON_WEB_TOKEN_SECRET_KEY);

//         res.status(200).json({
//             user:existinguser,
//             token:token,
//             msg:"User Authenticated!",
//             error:false
//         })

//     }
//     catch(err){
//         console.log('error:',err);
        
//         res.status(500).json({error:true,msg:"something went wrong!"})
//     }
// })

// router.get("/",async(req,res)=>{
//     const userlist=await user.find()

//     if(!userlist){
//         res.status(500).json({success:false})
//     }
//     res.send(userlist);
// })

// router.get("/:id",async(req,res)=>{

//     usereditid=req.params.id;

//     const userdata=await user.findById(req.params.id);

//     if(!userdata){
//         res.status(500),json({msg:"User with given id is not found!"})
//     }
//     res.status(200).send(userdata);
// })

// router.delete("/:id",async(req,res)=>{
//     const userdata=await user.findByIdAndDelete(req.params.id);

//     if(!userdata){
//         return res.status(404),json({msg:"User not found!"})
//     }
//     return res.status(200).json({success:true,msg:"the user is deleted!"});
// })

// router.get("/get/count",async(req,res)=>{
//     const usercount=await user.countDocuments((count)=> count)

//     if(!usercount){
//         res.status(500).json({success:false})
//     }
//     res.send({
//         usercount:usercount,
//     });
// })

// router.put('/:id',async(req,res)=>{
//     const {name,phone,email,password}=req.body;

//         const existinguser=await user.findById(req.params.id);

//         let newpassword;

//         if(req.body.password){
//             newpassword=await bcrypt.hash(req.body.password,10);
//         }
//         else{
//             newpassword=existinguser.password;
//         }
        
//         const userdata= await user.findByIdAndUpdate(req.params.id,{
//             name:name,
//             phone:phone,
//             email:email,
//             password:newpassword,
//             images:imagesarr
//         },{new:true})

//         if(!userdata){
//             return res.status(400).send("User cannot be updated!")
//         }
//         res.status(200).send(userdata);

// })

// export default router;

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import { user } from "../models/user.js";

dotenv.config();

const router = express.Router();

let imagesarr = [];
let usereditid;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve("uploads");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post("/uploadfiles", upload.array("images"), async (req, res) => {
  if (usereditid !== undefined) {
    const userimg = await user.findById(usereditid);

    if (userimg && userimg.images.length !== 0) {
      for (const image of userimg.images) {
        const filePath = path.resolve("uploads", image);
        try {
          await fs.access(filePath);
          await fs.unlink(filePath);
        } catch (err) {
          console.error(`Failed to delete file: ${filePath}`, err);
        }
      }
    }
  }
  imagesarr = req.files.map((file) => file.filename);
  
  res.json({ success: true, images: imagesarr });
});

router.post("/signup", async (req, res) => {
  const { name, phone, email, password } = req.body;
  try {
    const existinguser = await user.findOne({ email });
    const existinguserbyphone = await user.findOne({ phone });

    if (existinguser || existinguserbyphone) {
      return res.status(400).json({ error: true, msg: "User already exists!" });
    }

    const hashpassword = await bcrypt.hash(password, 12);
    const result = await user.create({
      name,
      phone,
      email,
      password: hashpassword,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

    res.status(200).json({ user: result, token, error: false });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: true, msg: "Something went wrong!" });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existinguser = await user.findOne({ email });
    if (!existinguser) {
      return res.status(404).json({ error: true, msg: "User not found!" });
    }

    const matchpassword = await bcrypt.compare(password, existinguser.password);
    if (!matchpassword) {
      return res.status(400).json({ error: true, msg: "Invalid credentials!" });
    }

    const token = jwt.sign({ email: existinguser.email, id: existinguser._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

    res.status(200).json({ user: existinguser, token, msg: "User Authenticated!", error: false });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: true, msg: "Something went wrong!" });
  }
});


router.get("/", async (req, res) => {
  try {
    const userlist = await user.find();
    res.status(200).send(userlist);
  } catch (err) {
    res.status(500).json({ success: false, msg: "Failed to fetch users" });
  }
});

router.get("/:id", async (req, res) => {
  usereditid = req.params.id;

  try {
    const userdata = await user.findById(req.params.id);
    if (!userdata) {
      return res.status(404).json({ msg: "User with given ID not found!" });
    }
    res.status(200).send(userdata);
  } catch (err) {
    res.status(500).json({ msg: "Error retrieving user" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userdata = await user.findByIdAndDelete(req.params.id);
    if (!userdata) {
      return res.status(404).json({ error: true, msg: "User not found!" });
    }
    res.status(200).json({ success: true, msg: "The user is deleted!" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting user" });
  }
});

router.get("/get/count", async (req, res) => {
  try {
    const usercount = await user.countDocuments();
    res.status(200).json({ usercount });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error fetching user count" });
  }
});

router.put("/:id", async (req, res) => {
  const { name, phone, email, password } = req.body;
  try {
    const existinguser = await user.findById(req.params.id);
    if (!existinguser) {
      return res.status(404).json({ error: true, msg: "User not found!" });
    }

    const newpassword = password ? await bcrypt.hash(password, 12) : existinguser.password;


    const userdata = await user.findByIdAndUpdate(
      req.params.id,
      { name, phone, email, password: newpassword, images: imagesarr },
      { new: true }
    );

    res.status(200).send(userdata);
  } catch (err) {
    res.status(500).json({ msg: "Error updating user" });
  }
});


router.put("/changepassword/:id", async (req, res) => {
  const { name, phone, email, password, newpass, images } = req.body;
  try {
    const existinguser = await user.findOne({email:email});
    if (!existinguser) {
      return res.status(404).json({ error: true, msg: "User not found!" });
    }

    const matchpassword = await bcrypt.compare(password,existinguser.password);

    if(!matchpassword){
      return res.json({error:true,msg:"Password didn't match!"})
    }

    let newpassword;

    if(newpass){
      newpassword= bcrypt.hashSync(newpass,10);
    }
    else{
      newpassword=existinguser.passwordhash;
    }


    const userdata = await user.findByIdAndUpdate(
      req.params.id,
      { name, phone, email, password: newpassword, images: imagesarr},
      { new: true }
    );

    res.status(200).send(userdata);
  } catch (err) {
    res.status(500).json({ error:true, msg: "Error updating user" });
  }
});

router.post("/authwithgoogle", async (req, res) => {
  const {name,phone,email,password,images,isadmin}=req.body;

  try{
    const existinguser=await user.findOne({email:email});
    if(!existinguser){
      const result=await user.create({
        name:name,
        phone:phone,
        email:email,
        password:password,
        images:images,
        isadmin:isadmin
      })

      const token=jwt.sign({email:result.email, id:result._id},process.env.JSON_WEB_TOKEN_SECRET_KEY);

      return res.status(200).json({
        user:result,
        token:token,
        error:false,
        msg:"User Logged in!"
      })
    }
    else{
      const token=jwt.sign({email:existinguser.email, id:existinguser._id},process.env.JSON_WEB_TOKEN_SECRET_KEY);

      return res.status(200).json({
        user:existinguser,
        token:token,
        error:false,
        msg:"User Logged in!"
      })
    }
  }
  catch(err){
    console.log(err);
  }
});

export default router;
