import mongoose from "mongoose";

const mylistSchema = mongoose.Schema({
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
  productid: {
    type: String,
    required: true,
  },
  userid: {
    type: String,
    required: true,
  },
});

mylistSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
mylistSchema.set("toJSON", {
  virtuals: true,
});

export const mylist = mongoose.model("mylist", mylistSchema);
export {mylistSchema};