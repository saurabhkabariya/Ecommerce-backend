
  import mongoose from "mongoose";
  
  const productweightSchema = mongoose.Schema({
    productweight: {
        type: String,
        required: true,
    },
  });
  
  productweightSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  productweightSchema.set("toJSON", {
    virtuals: true,
  });
  
  export const productweight = mongoose.model("productweight", productweightSchema);
  export {productweightSchema};