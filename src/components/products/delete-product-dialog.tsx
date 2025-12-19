"use client";

import { useState } from "react";

export function DeleteProductDialog({
  productName,
  onConfirm,
}: {
  productName: string;
  onConfirm: () => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <button className="rounded-md border px-2 py-1 text-xs" onClick={() => setOpen(true)}>
        Delete
      </button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-background p-4 shadow">
            <div className="text-sm font-semibold">Delete product?</div>
            <div className="mt-2 text-sm text-muted-foreground">
              This will permanently delete <span className="font-medium">{productName}</span> and remove its images from S3.
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="rounded-md border px-3 py-2 text-sm" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button
                className="rounded-md bg-destructive px-3 py-2 text-sm text-destructive-foreground"
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  try {
                    await onConfirm();
                    setOpen(false);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {loading ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
