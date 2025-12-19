export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";

export async function GET() {
  await connectDB();

  const [totalProducts, lowStock, outOfStock, paidRevenueAgg] = await Promise.all([
    Product.countDocuments({}),
    Product.countDocuments({ stock: { $lte: 5 } }),
    Product.countDocuments({ stock: 0 }),
    Order.aggregate([
      { $match: { status: "paid" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: null,
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          units: { $sum: "$items.quantity" },
        },
      },
    ]),
  ]);

  return NextResponse.json({
    totalProducts,
    lowStock,
    outOfStock,
    revenue: paidRevenueAgg[0]?.revenue ?? 0,
    units: paidRevenueAgg[0]?.units ?? 0,
  });
}
