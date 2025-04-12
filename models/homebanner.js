import mongoose from "mongoose";

const homebannerSchema = mongoose.Schema({
  images:
  [
    {
      type: String,
      required: true,
    },
  ],
});

homebannerSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
homebannerSchema.set("toJSON", {
  virtuals: true,
});

export const homebanner = mongoose.model("homebanner", homebannerSchema);
export {homebannerSchema};