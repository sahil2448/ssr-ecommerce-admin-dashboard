import { api } from "@/lib/http";

type PresignRes = { uploadUrl: string; key: string; publicUrl: string };

export async function uploadToS3(file: File) {
  const presign = await api<PresignRes>("/api/uploads/presign", {
    method: "POST",
    body: JSON.stringify({ fileName: file.name, fileType: file.type, folder: "products" }),
  });

  const put = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!put.ok) {
    const text = await put.text().catch(() => "");
    console.error("S3 PUT failed:", put.status, text);
    throw new Error(`S3 upload failed (${put.status})`);
  }

  return { url: presign.publicUrl, key: presign.key };
}
