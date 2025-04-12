
  import mongoose from "mongoose";
  
  const productsizeSchema = mongoose.Schema({
    productsize: {
        type: String,
        required: true,
    },
  });
  
  productsizeSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  productsizeSchema.set("toJSON", {
    virtuals: true,
  });
  
  export const productsize = mongoose.model("productsize", productsizeSchema);
  export {productsizeSchema};