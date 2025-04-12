import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  brand: {
    type: String,
    default:"",
  },
  price: {
    type: Number,
    default:0,
  },
  oldprice: {
    type: Number,
    default:0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Category',
    required: true,
  },
  catname: {
    type: String,
    default:"",
  },
  subcatname: {
    type: String,
    default:"",
  },
  subcatid: {
    type: String,
    default:"",
  },
  subcat: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Subcat',
    required: true,
  },
  countInStock: {
    type: Number,
    required:true,
  },
  rating: {
    type: Number,
    default:0,
  },
  isFeatured: {
    type: Boolean,
    default:false,
  },
  discount: {
    type: Number,
    default:0,
    required: true,
  },

  productrams:
    [{
      type: String,
      // ref:'productrams',
    },],
  productsize:
    [{
      type: String,
      // ref:'productsize',
    },],
  productweight:
    [{
      type: String,
      // ref:'productweight',
    },],

    location: {
      type: String,
      default: "All"
    },

  dateCreated: {
    type: Date,
    default:Date.now,
  },
  
});

productSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
productSchema.set("toJSON", {
  virtuals: true,
});

export const Product = mongoose.model("Product", productSchema);
export {productSchema};