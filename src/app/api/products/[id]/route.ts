export const runtime = "nodejs";

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { UpdateProductSchema } from "@/lib/validators/product";
import { s3, AWS_S3_BUCKET } from "@/lib/s3";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";

function badId(id: string) {
  return !mongoose.Types.ObjectId.isValid(id);
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  if (badId(params.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  await connectDB();

  const product = await Product.findById(params.id).lean();
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(product);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (badId(params.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  await connectDB();

  const body = await req.json();
  const parsed = UpdateProductSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const updated = await Product.findByIdAndUpdate(params.id, parsed.data, { new: true }).lean();
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (badId(params.id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  await connectDB();

  const deleted = await Product.findByIdAndDelete(params.id).lean();
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const keys = (deleted.images ?? []).map((img: any) => img?.key).filter(Boolean);

  if (keys.length > 0) {
    await s3.send(
      new DeleteObjectsCommand({
        Bucket: AWS_S3_BUCKET,
        Delete: { Objects: keys.map((Key) => ({ Key })) },
      })
    );
  }

  return NextResponse.json({ ok: true });
}
