
  import mongoose from "mongoose";
  
  const subcatSchema = mongoose.Schema({
    cat: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Category',
      required: true,
    },
    subcat: {
        type: String,
        required: true,
    },
  });
  
  subcatSchema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  subcatSchema.set("toJSON", {
    virtuals: true,
  });
  
  export const Subcat = mongoose.model("Subcat", subcatSchema);
  export {subcatSchema};