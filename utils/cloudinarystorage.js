// utils/cloudinaryStorage.js
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryconfig.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerce-products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
    public_id: (req, file) => `product-${Date.now()}-${file.originalname}`,
  },
});

export default storage;
