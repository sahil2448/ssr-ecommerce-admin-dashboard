export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";

export async function GET(req: Request) {
  await connectDB();
  const url = new URL(req.url);
  const days = Number(url.searchParams.get("days") ?? "30");
  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const data = await Order.aggregate([
    { $match: { status: "paid", createdAt: { $gte: from } } },
    { $unwind: "$items" },
    {
      $facet: {
        daily: [
          {
            $group: {
              _id: {
                y: { $year: "$createdAt" },
                m: { $month: "$createdAt" },
                d: { $dayOfMonth: "$createdAt" },
              },
              revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
              units: { $sum: "$items.quantity" },
            },
          },
          { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } },
        ],
        topProducts: [
          {
            $group: {
              _id: "$items.productId",
              units: { $sum: "$items.quantity" },
              revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
            },
          },
          { $sort: { revenue: -1 } },
          { $limit: 5 },
        ],
      },
    },
  ]);

  return NextResponse.json(data[0] ?? { daily: [], topProducts: [] });
}
