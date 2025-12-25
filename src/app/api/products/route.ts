export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { CreateProductSchema, ListProductsQuerySchema } from "@/lib/validators/product";
import { auth } from "@/lib/auth/auth";

export async function GET(req: Request) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const url = new URL(req.url);

  const parsed = ListProductsQuerySchema.safeParse({
    page: url.searchParams.get("page") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
    search: url.searchParams.get("search") ?? undefined,
    category: url.searchParams.get("category") ?? undefined,
    isActive: url.searchParams.get("isActive") ?? undefined,
    sort: url.searchParams.get("sort") ?? undefined,
  });

  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { page, limit, search, category, isActive, sort } = parsed.data;

  const filter: any = {}; 
  if (search) filter.name = { $regex: search, $options: "i" };
  if (category) filter.category = category;
  if (typeof isActive === "boolean") filter.isActive = isActive;

  const sortMap: Record<string, any> = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    stock_asc: { stock: 1 },
    stock_desc: { stock: -1 },
  };

  const [items, total] = await Promise.all([
    Product.find(filter).sort(sortMap[sort]).skip((page - 1) * limit).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  return NextResponse.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: Request) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role === "viewer") {
    return NextResponse.json({ error: "Forbidden: Viewers cannot create products" }, { status: 403 });
  }

  await connectDB();
  const body = await req.json();

  const parsed = CreateProductSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const created = await Product.create(parsed.data);
  return NextResponse.json(created, { status: 201 });
}
