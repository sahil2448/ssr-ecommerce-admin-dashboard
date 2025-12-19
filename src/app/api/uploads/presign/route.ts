export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { z } from "zod";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import { s3, AWS_REGION, AWS_S3_BUCKET } from "@/lib/s3";

const PresignSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string().min(1),
  folder: z.string().optional().default("products"),
});

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = PresignSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { fileName, fileType, folder } = parsed.data;

  const ext = sanitizeFileName(fileName).split(".").pop() || "bin";
  const key = `${folder}/${crypto.randomUUID()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: AWS_S3_BUCKET,
    Key: key,
    ContentType: fileType,
    // Disable automatic checksum to avoid signature mismatch
    ChecksumAlgorithm: undefined,
  });

  // Sign without checksum parameters
  const uploadUrl = await getSignedUrl(s3, command, { 
    expiresIn: 60 * 5,
    unhoistableHeaders: new Set(["x-amz-checksum-crc32"]),
  });

  const publicUrl = `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;

  return NextResponse.json({ uploadUrl, key, publicUrl });
}
