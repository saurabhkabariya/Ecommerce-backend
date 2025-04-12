
  import mongoose from "mongoose";
  
  const productreviewsschema = mongoose.Schema({
    productid: {
        type: String,
        required: true,
    },
    customername: {
        type: String,
        required: true,
    },
    customerid: {
        type: String,
        required: true,
    },
    review: {
        type: String,
        required: true,
        default:""
    },
    customerrating: {
        type: Number,
        required: true,
        default:1
    },
    dateCreated: {
        type: Date,
        default:Date.now,
    },
  });
  
  productreviewsschema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  productreviewsschema.set("toJSON", {
    virtuals: true,
  });
  
  export const productreviews = mongoose.model("productreviews", productreviewsschema);
  export {productreviewsschema};