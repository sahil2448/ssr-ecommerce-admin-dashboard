export const runtime = "nodejs";

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { UpdateProductSchema } from "@/lib/validators/product";
import { s3, AWS_S3_BUCKET } from "@/lib/s3";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { auth } from "@/lib/auth/auth";

function badId(id: string) {
  return !mongoose.Types.ObjectId.isValid(id);
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (badId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  await connectDB();

  const product = await Product.findById(id).lean();
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(product);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role === "viewer") {
    return NextResponse.json({ error: "Forbidden: Viewers cannot edit products" }, { status: 403 });
  }

  const { id } = await params;
  if (badId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  await connectDB();

  const existing = await Product.findById(id).lean();
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = UpdateProductSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  if (parsed.data.images) {
    const prevKeys = new Set((existing.images ?? []).map((i: any) => i.key));
    const nextKeys = new Set((parsed.data.images ?? []).map((i: any) => i.key));
    const removedKeys = [...prevKeys].filter((k) => !nextKeys.has(k));

    if (removedKeys.length > 0) {
      await s3.send(
        new DeleteObjectsCommand({
          Bucket: AWS_S3_BUCKET,
          Delete: { Objects: removedKeys.map((Key) => ({ Key:Key as string})) },
        })
      );
    }
  }

  const updated = await Product.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden: Only admins can delete products" }, { status: 403 });
  }

  const { id } = await params;
  if (badId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  await connectDB();

  const deleted = await Product.findByIdAndDelete(id).lean();
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
