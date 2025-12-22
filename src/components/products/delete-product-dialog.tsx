"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

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
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-md border border-red-200 dark:border-red-800 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
      >
        <Trash2 className="h-3 w-3" />
        Delete
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-xl border">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Delete Product</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Are you sure you want to delete <span className="font-medium text-foreground">{productName}</span>?
                This will permanently remove all images and data.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setLoading(true);
                  try {
                    await onConfirm();
                    setOpen(false);
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Deleting..." : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
