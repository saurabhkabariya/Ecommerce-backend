import { time } from "console";
import mongoose from "mongoose";
import { type } from "os";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  images:[{
      type:String
    },
  ],
  phone: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique:true,
  },
  password: {
    type: String,
  },
  isadmin: {
    type: Boolean,
    default: false,
  },
  isverified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
  },
  otpexpires: {
    type: Date,
  },
  date: {
    type:Date,
    default: Date.now,
  }

},{timestamps:true});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
userSchema.set("toJSON", {
  virtuals: true,
});

export const user = mongoose.model("user", userSchema);
export {userSchema};