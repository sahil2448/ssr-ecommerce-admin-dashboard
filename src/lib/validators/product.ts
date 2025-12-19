import { z } from "zod";

export const ProductImageSchema = z.object({
  url: z.string().url(),
  key: z.string().min(1),
});

export const CreateProductSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(10).max(5000),
  category: z.string().min(2).max(60),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  sku: z.string().min(3).max(40),
  images: z.array(ProductImageSchema).min(1).max(8),
  isActive: z.boolean().optional(),
});

export const UpdateProductSchema = CreateProductSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" }
);

export const ListProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "stock_asc", "stock_desc"]).default("newest"),
});
