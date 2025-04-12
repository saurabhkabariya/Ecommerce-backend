
  import mongoose from "mongoose";
  
  const productramsSchema = mongoose.Schema({
    productrams: {
        type: String,
        required: true,
    },
  });
  
  productramsSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  productramsSchema.set("toJSON", {
    virtuals: true,
  });
  
  export const productrams = mongoose.model("productrams", productramsSchema);
  export {productramsSchema};