import {orders} from "../models/orders.js";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();


router.get("/", async (req, res) => {
  
  // const page= parseInt(req.query.page) || 1;
  // const perpage= parseInt(req.query.perpage) || 5;
  // const totalposts = await orders.countDocuments();
  // const totalpages= Math.ceil(totalposts/perpage);

  // const email = req.query.email;

  // if(page>totalpages){
  //   return res.status(404).json({message:"page not found"})
  // }

  // const filter = { email };
  
  const orderslist = await orders.find({userid:req.query.userid});
    // .skip((page-1)*perpage)
    // .limit(perpage)
    // .exec();

  if (!orderslist) {
    return res.status(500).json({ success: false });
  }

  // return res.status(200).json({
  //   "orderslist":orderslist,
  //   "totalpages":totalpages,
  //   "page":page
  // })

  return res.status(200).json(orderslist);
  
});

router.get("/:id",async(req,res)=>{

  const order = await orders.findById(req.params.id);

  if (!order) {
    res.status(500).json({ message: "The order with the given id is not found!" });
  }
  return res.status(200).send(order);
})

router.post("/create", async (req, res) => {


  let orderslist = new orders({
    name: req.body.name,
    phonenumber: req.body.phonenumber,
    address: req.body.address,
    zipcode: req.body.zipcode,
    amount: req.body.amount/100,
    paymentid: req.body.paymentid,
    email: req.body.email,
    userid: req.body.userid,
    products: req.body.products
  });
 
  if (!orderslist) {
    res.status(500).json({
      error: err,
      success: false,
    });
  }
  orderslist = await orderslist.save();

  res.status(201).json(orderslist);
});

router.delete("/:id",async(req,res)=>{
  const deleteorder = await orders.findByIdAndDelete(req.params.id);

  if (!deleteorder) {
    res.status(404).json({ message: "order not found!",
      success:false
     });
  }
  return res.status(200).json({
    success:true,
    message:"order deleted successfully"
  });
})

router.put("/:id", async (req, res) => {


  let orderslist = await orders.findByIdAndUpdate(
    req.params.id,
    {
    name: req.body.name,
    phonenumber: req.body.phonenumber,
    address: req.body.address,
    zipcode: req.body.zipcode,
    amount: req.body.amount/100,
    paymentid: req.body.paymentid,
    email: req.body.email,
    userid: req.body.userid,
    products: req.body.products,
    status:req.body.status
    },
    {new:true}
);
 
if (!orderslist) {
  res.status(500).json({ message: "Order can not be updated!",
    success:false
   });
}
res.send(orderslist)
});


export default router;
 