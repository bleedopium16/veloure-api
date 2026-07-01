import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/Product.js";

dotenv.config();

// Your real Veloure catalog. Prices are stored as plain NUMBERS (no rupee
// symbol) so the backend can calculate cart and order totals. The frontend
// adds the rupee symbol back when displaying. Images keep their /images/...
// paths, which your frontend serves from its public/images folder.
const products = [
  // ---------------- MAKEUP ----------------
  { name: "Christian Dior Addict Lip Maximizer Gloss [001 Pink]", price: 4952, image: "/images/M1.jpg", category: "makeup" },
  { name: "Christian Dior Addict Lip Maximizer Gloss [015 Cherry]", price: 4791, image: "/images/M2.jpg", category: "makeup" },
  { name: "Christian Dior Addict Lip Maximizer Gloss [007 Raspberry]", price: 4952, image: "/images/M3.jpg", category: "makeup" },
  { name: "Christian Dior Addict Lip Maximizer Gloss [006 Berry]", price: 4952, image: "/images/M4.jpg", category: "makeup" },
  { name: "Makeup Palettes", price: 1500, image: "/images/M5.jpg", category: "makeup" },
  { name: "Makeup Palettes", price: 2000, image: "/images/M6.jpg", category: "makeup" },
  { name: "Dior Makeup Palettes", price: 2300, image: "/images/M7.jpg", category: "makeup" },
  { name: "Dior Makeup Palettes", price: 3600, image: "/images/M8.jpg", category: "makeup" },
  { name: "Makeup Brush", price: 599, image: "/images/M9.jpg", category: "makeup" },
  { name: "Makeup Brush", price: 699, image: "/images/M10.jpg", category: "makeup" },
  { name: "Makeup Brush", price: 799, image: "/images/M11.jpg", category: "makeup" },
  { name: "Makeup Brush [5-pairs]", price: 2000, image: "/images/M12.jpg", category: "makeup" },
  { name: "Dior Eye-liner", price: 2000, image: "/images/M13.jpg", category: "makeup" },
  { name: "Dior Sleek Black Eyelasher Culer", price: 1000, image: "/images/M14.jpg", category: "makeup" },
  { name: "B Sponge", price: 500, image: "/images/M15.jpg", category: "makeup" },
  { name: "Black Obsidian Face-Roller with Gua-Sha stone [2 pc]", price: 1565, image: "/images/M16.jpg", category: "makeup" },
  { name: "Rhode Hydrating Peptide Lip Tint [Ribbon]", price: 349, image: "/images/M17.jpg", category: "makeup" },
  { name: "Rhode Hydrating Peptide Lip Tint [Raspberry]", price: 349, image: "/images/M18.jpg", category: "makeup" },
  { name: "Rhode Hydrating Peptide Lip Tint [Espresso]", price: 349, image: "/images/M19.jpg", category: "makeup" },
  { name: "Rhode Hydrating Peptide Lip Tint [Toast]", price: 349, image: "/images/M20.jpg", category: "makeup" },
  { name: "Mascara", price: 449, image: "/images/M21.jpg", category: "makeup" },
  { name: "NARS Light Reflecting Foundation - Stromboli (30 ml)", price: 3499, image: "/images/M23.jpg", category: "makeup" },

  // ---------------- SKINCARE ----------------
  { name: "Vitamin C Serum", price: 999, image: "/images/P1.jpg", category: "skincare" },
  { name: "Vitamin C+E Super-Bright Sunscreen", price: 499, image: "/images/P9.jpg", category: "skincare" },
  { name: "Nature Sunscreen SPF50+", price: 699, image: "/images/P4.jpg", category: "skincare" },
  { name: "Face Cleanser", price: 499, image: "/images/P3.jpg", category: "skincare" },
  { name: "Veloure's Micellar Water", price: 599, image: "/images/P5.jpg", category: "skincare" },
  { name: "Vitamin C+E Super-Bright Sunscreen", price: 499, image: "/images/P10.jpg", category: "skincare" },
  { name: "Face Toner", price: 399, image: "/images/P6.jpg", category: "skincare" },
  { name: "CICA & B5 Repairing Serum", price: 699, image: "/images/P7.jpg", category: "skincare" },
  { name: "La Creme Riche [The-Rich Cream]", price: 599, image: "/images/P8.jpg", category: "skincare" },
  { name: "Hydrating Cream", price: 599, image: "/images/P2.jpg", category: "skincare" },
  { name: "COLLAGEN Night Wrapping-Mask", price: 450, image: "/images/P11.jpg", category: "skincare" },
  { name: "Copper Peptide Face-Serum", price: 699, image: "/images/P12.jpg", category: "skincare" },

  // ---------------- HAIRCARE ----------------
  { name: "Deep Damage Repair Shampoo", price: 599, image: "/images/M36.jpg", category: "haircare" },
  { name: "NUVE's Shampoo + Conditioner", price: 640, image: "/images/M37.jpg", category: "haircare" },
  { name: "Hair Nourishing Oil", price: 550, image: "/images/M88.jpg", category: "haircare" },
  { name: "Heat Protector Spray", price: 599, image: "/images/M39.jpg", category: "haircare" },
  { name: "Spa Hair-Band", price: 399, image: "/images/M24.jpg", category: "haircare" },
  { name: "Silk Hair Bonnets", price: 799, image: "/images/M35.jpg", category: "haircare" },
  { name: "Spa Hair-Band [Sky-Blue]", price: 399, image: "/images/M25.jpg", category: "haircare" },
  { name: "Spa Hair-Band [Bunny edition]", price: 399, image: "/images/M26.jpg", category: "haircare" },
  { name: "Spa Hair-Band [light green]", price: 399, image: "/images/M31.jpg", category: "haircare" },
  { name: "Regular Hairbrush", price: 1299, image: "/images/M32.jpg", category: "haircare" },
  { name: "Hair Scalp Massager & Anti Dandruff Shampoo Brush", price: 99, image: "/images/M33.jpg", category: "haircare" },
  { name: "Brushworks Hair Oil Applicator", price: 392, image: "/images/M34.jpg", category: "haircare" },

  // ---------------- BESTSELLERS ----------------
  { name: "Lip-Gloss", price: 999, image: "/images/bestseller1.jpg", category: "makeup", bestseller: true },
  { name: "HydraSilk Moisturizer", price: 799, image: "/images/bestseller2.jpg", category: "skincare", bestseller: true },
  { name: "Perfume [Pink-Rose]", price: 599, image: "/images/bestseller3.jpg", category: "makeup", bestseller: true },
  { name: "Botanic Cleanse Gel", price: 699, image: "/images/bestseller4.jpg", category: "skincare", bestseller: true },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Product.deleteMany({}); // clear the old placeholder products
    await Product.insertMany(products);
    console.log(`🌱 Seeded ${products.length} products`);

    await mongoose.disconnect();
    console.log("Done.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
