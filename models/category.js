import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  
  images: [
    {
      type: String,
    },
  ],
  slug: {
    type: String,
    required: true,
    unique: true
  },
  parentid: {
    type: String
  }
},{timestamps:true});

categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});
categorySchema.set("toJSON", {
  virtuals: true,
});

export const Category = mongoose.model("Category", categorySchema);
export {categorySchema};