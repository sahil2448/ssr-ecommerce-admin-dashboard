import mongoose, { Schema } from "mongoose";

interface OrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number; // snapshot price
}

interface OrderDoc extends mongoose.Document {
  status: "paid" | "refunded" | "cancelled";
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<OrderDoc>(
  {
    status: { type: String, enum: ["paid", "refunded", "cancelled"], required: true, index: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model<OrderDoc>("Order", OrderSchema);
