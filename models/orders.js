import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  zipcode: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  paymentid: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  userid: {
    type: String,
    required: true,
  },
  products:[ 
    {
      productid: {
        type: String,
      },
      producttitle: {
        type: String,
      },
      quantity: {
        type: Number,
      },
      price: {
        type: Number,
      },
      image: {
        type: String,
      },
      subtotal: {
        type: Number,
      }
    }
  ],
  status:{
    type: String,
    default: "pending"
  },
  date: {
    type: Date,
    default: Date.now,
  },
  
});

orderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
orderSchema.set("toJSON", {
  virtuals: true,
});

export const orders = mongoose.model("orders", orderSchema);
export {orderSchema};