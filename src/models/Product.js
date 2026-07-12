import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true }, // URL or path to the product image
    category: {
      type: String,
      required: true,
      enum: ["makeup", "skincare", "haircare"],
    },
    description: { type: String, default: "" },
    stock: { type: Number, default: 100, min: 0 },
    bestseller: { type: Boolean, default: false },
  },
  { timestamps: true } 
);

export default mongoose.model("Product", productSchema);
