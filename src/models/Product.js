import mongoose from "mongoose";

// A Product is one item in the store. The category field is restricted to the
// three sections your site already has, so a typo can never sneak into the DB.
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
  { timestamps: true } // adds createdAt / updatedAt automatically
);

export default mongoose.model("Product", productSchema);
