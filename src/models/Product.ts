import mongoose, { Schema } from "mongoose";

export type ProductImage = {
  url: string; // S3 object URL
  key: string; // S3 object key (for deletion)
};

export interface ProductDoc extends mongoose.Document {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  images: ProductImage[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<ProductDoc>(
  {
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, index: true },
    sku: { type: String, required: true, unique: true, index: true },
    images: {
      type: [
        {
          url: { type: String, required: true },
          key: { type: String, required: true },
        },
      ],
      default: [],
    },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model<ProductDoc>("Product", ProductSchema);
