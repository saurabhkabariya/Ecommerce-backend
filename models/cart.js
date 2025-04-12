import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
  producttitle: {
    type: String,
    required: true,
  },
  
  image: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  productid: {
    type: String,
    required: true,
  },
  userid: {
    type: String,
    required: true,
  },
});

cartSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
cartSchema.set("toJSON", {
  virtuals: true,
});

export const cart = mongoose.model("cart", cartSchema);
export {cartSchema};