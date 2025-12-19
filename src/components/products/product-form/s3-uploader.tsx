"use client";

import { useState } from "react";
import { uploadToS3 } from "@/lib/s3-upload";
import { toast } from "sonner";

export function S3Uploader({ onUploaded }: { onUploaded: (img: { url: string; key: string }) => void }) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="rounded-md border p-3">
      <div className="text-sm font-medium">Upload image</div>
      <p className="text-xs text-muted-foreground">Secure upload via presigned S3 URL.</p>

      <input
        className="mt-2 block w-full text-sm"
        type="file"
        accept="image/*"
        disabled={loading}
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setLoading(true);
          try {
            const img = await uploadToS3(f);
            onUploaded(img);
            toast.success("Uploaded");
          } catch (err: any) {
            toast.error(err?.message ?? "Upload failed");
          } finally {
            setLoading(false);
            e.target.value = "";
          }
        }}
      />
    </div>
  );
}
